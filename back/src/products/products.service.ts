import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between, FindOptionsWhere } from 'typeorm';
import * as XLSX from 'xlsx';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductType, ProductSize } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existingProduct = await this.productsRepository.findOne({
      where: { reference: createProductDto.reference }
    });

    if (existingProduct) {
      throw new ConflictException(`Ya existe un producto con la referencia ${createProductDto.reference}`);
    }

    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(
    page: number = 1,
    limit: number = 15,
    productType?: ProductType,
    categoryId?: string,
    search?: string,
    sortBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<{ data: Product[]; total: number; page: number; totalPages: number }> {
    const where: FindOptionsWhere<Product> = { isActive: true };

    if (productType) {
      where.productType = productType;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      const queryBuilder = this.productsRepository.createQueryBuilder('product');
      queryBuilder.where('product.isActive = :isActive', { isActive: true });

      if (productType) {
        queryBuilder.andWhere('product.productType = :productType', { productType });
      }

      if (categoryId) {
        queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
      }

      queryBuilder.andWhere(
        '(LOWER(product.name) LIKE :search OR LOWER(product.description) LIKE :search OR LOWER(product.reference) LIKE :search)',
        { search: `%${search.toLowerCase()}%` }
      );

      if (sortBy === 'price') {
        queryBuilder.orderBy('product.price', sortOrder);
      } else if (sortBy === 'name') {
        queryBuilder.orderBy('product.name', sortOrder);
      } else {
        queryBuilder.orderBy('product.createdAt', 'DESC');
      }

      queryBuilder.skip((page - 1) * limit).take(limit);

      const [data, total] = await queryBuilder.getManyAndCount();

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }

    let order: any = { createdAt: 'DESC' };
    if (sortBy === 'price') {
      order = { price: sortOrder };
    } else if (sortBy === 'name') {
      order = { name: sortOrder };
    }

    const [data, total] = await this.productsRepository.findAndCount({
      where,
      order,
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        category: true,
      },
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async findByReference(reference: string): Promise<Product | null> {
    return this.productsRepository.findOne({
      where: { reference },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.reference && updateProductDto.reference !== product.reference) {
      const existingProduct = await this.productsRepository.findOne({
        where: { reference: updateProductDto.reference }
      });

      if (existingProduct) {
        throw new ConflictException(`Ya existe un producto con la referencia ${updateProductDto.reference}`);
      }
    }

    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<{ message: string }> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
    return { message: `Producto con ID ${id} eliminado correctamente` };
  }

  async importFromExcel(fileBuffer: Buffer): Promise<{ imported: number; errors: string[] }> {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    let imported = 0;
    const errors: string[] = [];

    const validSizes = Object.values(ProductSize);

    for (const row of data) {
      try {
        const productData = this.mapExcelRowToProductDto(row, validSizes);
        const existingProduct = await this.findByReference(productData.reference);

        if (existingProduct) {
          await this.update(existingProduct.id, productData);
        } else {
          await this.create(productData);
        }
        imported++;
      } catch (error) {
        this.logger.error(`Error importing row: ${error.message}`);
        errors.push(`Error en fila ${data.indexOf(row) + 2}: ${error.message}`);
      }
    }

    return { imported, errors };
  }

  private mapExcelRowToProductDto(row: any, validSizes: string[]): CreateProductDto {
    // Procesar tallas
    let sizes: ProductSize[] = [ProductSize.S, ProductSize.M, ProductSize.L];
    if (row.sizes) {
      const sizeStrings = row.sizes.split(',').map(s => s.trim().toUpperCase());
      sizes = sizeStrings.filter(s => validSizes.includes(s)) as ProductSize[];
      if (sizes.length === 0) sizes = [ProductSize.S, ProductSize.M, ProductSize.L];
    }

    // Procesar colores
    let colors: string[] = [];
    if (row.colors) {
      colors = row.colors.split(',').map(c => c.trim());
    }

    // Procesar imágenes
    let images: string[] = [];
    if (row.images) {
      images = row.images.split(',').map(i => i.trim());
    }

    // Procesar características
    let features: string[] = [];
    if (row.features) {
      features = row.features.split('|').map(f => f.trim());
    }

    return {
      name: row.name || row.Nombre,
      description: row.description || row.Descripción || '',
      reference: row.reference || row.Referencia,
      price: parseFloat(row.price || row.Precio) || 0,
      comparePrice: row.comparePrice ? parseFloat(row.comparePrice) : undefined,
      productType: (row.productType || row.Tipo || ProductType.CORPORATIVO) as ProductType,
      categoryId: row.categoryId || row.CategoriaId,
      subcategory: row.subcategory || row.Subcategoria,
      sizes,
      colors,
      material: row.material,
      weight: row.weight,
      stock: parseInt(row.stock) || 0,
      minOrder: parseInt(row.minOrder) || 10,
      imageUrl: row.imageUrl,
      images,
      isActive: row.isActive !== undefined ? row.isActive !== 'false' : true,
      isNew: row.isNew === 'true',
      isFeatured: row.isFeatured === 'true',
      hasDiscount: row.hasDiscount === 'true',
      discount: parseInt(row.discount) || 0,
      reinforcement: row.reinforcement === 'true',
      reflective: row.reflective === 'true',
      thermal: row.thermal === 'true',
      embroidery: (row.embroideryIncluded === 'true') ? {
        included: true,
        maxStitches: parseInt(row.embroideryMaxStitches) || 15000,
        colors: parseInt(row.embroideryColors) || 6,
        positions: row.embroideryPositions ? row.embroideryPositions.split(',') : ['Pecho izquierdo'],
      } : undefined,
      features,
    };
  }

  async getStats(): Promise<{
    total: number;
    byType: Record<ProductType, number>;
    lowStock: number;
    outOfStock: number;
  }> {
    const total = await this.productsRepository.count();

    const byType = {
      [ProductType.CORPORATIVO]: await this.productsRepository.count({ where: { productType: ProductType.CORPORATIVO } }),
      [ProductType.INDUSTRIAL]: await this.productsRepository.count({ where: { productType: ProductType.INDUSTRIAL } }),
      [ProductType.BORDADOS]: await this.productsRepository.count({ where: { productType: ProductType.BORDADOS } }),
      [ProductType.EQUIPOS]: await this.productsRepository.count({ where: { productType: ProductType.EQUIPOS } }),
    };

    const lowStock = await this.productsRepository.count({ where: { stock: Between(1, 10) } });
    const outOfStock = await this.productsRepository.count({ where: { stock: 0 } });

    return { total, byType, lowStock, outOfStock };
  }
}