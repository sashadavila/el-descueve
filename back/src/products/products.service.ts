import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between, FindOptionsWhere } from 'typeorm';
import * as XLSX from 'xlsx';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductType, ProductSize } from './entities/product.entity';
import { CategoriesService } from '../categories/categories.service';
import { OrderItem } from '../order-items/entities/order-item.entity';

// Definir la interfaz para las filas del Excel
interface ExcelRow {
  name?: string;
  Nombre?: string;
  description?: string;
  Descripción?: string;
  reference?: string;
  Referencia?: string;
  price?: string | number;
  Precio?: string | number;
  comparePrice?: string | number;
  productType?: string;
  Tipo?: string;
  category?: string;
  Categoria?: string;
  categoryId?: string;
  CategoriaId?: string;
  subcategory?: string;
  Subcategoria?: string;
  sizes?: string;
  colors?: string;
  material?: string;
  weight?: string;
  stock?: string | number;
  minOrder?: string | number;
  imageUrl?: string;
  images?: string;
  isActive?: string | boolean;
  isNew?: string | boolean;
  isFeatured?: string | boolean;
  hasDiscount?: string | boolean;
  discount?: string | number;
  reinforcement?: string | boolean;
  reflective?: string | boolean;
  thermal?: string | boolean;
  embroideryIncluded?: string | boolean;
  embroideryMaxStitches?: string | number;
  embroideryColors?: string | number;
  embroideryPositions?: string;
  features?: string;
}

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    private readonly categoriesService: CategoriesService,
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
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    isFeatured?: boolean,
    isNew?: boolean,
  ): Promise<{ data: Product[]; total: number; page: number; totalPages: number }> {
    // IMPORTANTE: No filtrar por isActive aquí si quieres ver todos
    const where: FindOptionsWhere<Product> = {}; // ← REMOVER { isActive: true } temporalmente

    console.log('📊 [ProductsService] findAll - Parámetros:');
    console.log('  page:', page, 'limit:', limit);
    console.log('  where sin filtros:', where);

    // Contar el total de productos (sin filtros de actividad)
    const totalActive = await this.productsRepository.count();
    console.log('📊 [ProductsService] Total productos en BD (sin filtros):', totalActive);

    if (productType) {
      where.productType = productType;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (isNew !== undefined) {
      where.isNew = isNew;
    }

    // Si hay búsqueda, usar query builder
    if (search) {
      const queryBuilder = this.productsRepository.createQueryBuilder('product');
      // No filtrar por isActive aquí tampoco
      // queryBuilder.where('product.isActive = :isActive', { isActive: true });

      if (productType) {
        queryBuilder.andWhere('product.productType = :productType', { productType });
      }

      if (categoryId) {
        queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
      }

      if (isFeatured !== undefined) {
        queryBuilder.andWhere('product.isFeatured = :isFeatured', { isFeatured });
      }

      if (isNew !== undefined) {
        queryBuilder.andWhere('product.isNew = :isNew', { isNew });
      }

      if (search) {
        queryBuilder.andWhere(
          '(LOWER(product.name) LIKE :search OR LOWER(product.description) LIKE :search OR LOWER(product.reference) LIKE :search)',
          { search: `%${search.toLowerCase()}%` }
        );
      }

      if (sortBy === 'price') {
        queryBuilder.orderBy('product.price', sortOrder);
      } else if (sortBy === 'name') {
        queryBuilder.orderBy('product.name', sortOrder);
      } else {
        queryBuilder.orderBy('product.createdAt', 'DESC');
      }

      queryBuilder.skip((page - 1) * limit).take(limit);

      const [data, total] = await queryBuilder.getManyAndCount();

      console.log('📊 [ProductsService] Búsqueda - Encontrados:', total, 'Retornando:', data.length);

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }

    // Sin búsqueda
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

    console.log('📊 [ProductsService] findAndCount - Encontrados total:', total, 'Retornando:', data.length);
    console.log('📊 [ProductsService] Primeros 5 productos:', data.slice(0, 5).map(p => ({ id: p.id, name: p.name })));

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

    // Verificar si el producto está en alguna orden
    const orderItems = await this.orderItemsRepository.find({
      where: { productId: id },
      relations: ['order'],
    });

    if (orderItems.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar el producto "${product.name}" porque tiene ${orderItems.length} pedidos asociados. ` +
        `Primero elimina las órdenes relacionadas o cambia el estado del producto a inactivo.`
      );
    }

    await this.productsRepository.remove(product);
    this.logger.log(`✅ Producto eliminado: ${product.name} (${product.reference})`);
    return { message: `Producto con ID ${id} eliminado correctamente` };
  }

  // Obtener o crear categoría por nombre
  private async getOrCreateCategory(categoryName: string): Promise<string> {
    if (!categoryName) {
      throw new Error('El nombre de la categoría es requerido');
    }

    // Buscar categoría por nombre (case insensitive)
    const existingCategory = await this.categoriesService.findByName(categoryName);

    if (existingCategory) {
      this.logger.log(`Categoría encontrada: ${categoryName} (ID: ${existingCategory.id})`);
      return existingCategory.id;
    }

    // Crear nueva categoría
    this.logger.log(`Creando nueva categoría: ${categoryName}`);
    const newCategory = await this.categoriesService.create({
      name: categoryName,
      description: `Categoría ${categoryName} creada automáticamente desde importación de productos`,
      isActive: true,
    });

    this.logger.log(`Categoría creada: ${categoryName} (ID: ${newCategory.id})`);
    return newCategory.id;
  }

  // Helper para obtener valor de string de una fila
  private getStringValue(row: ExcelRow, keys: string[]): string {
    for (const key of keys) {
      const value = row[key as keyof ExcelRow];
      if (value && typeof value === 'string') return value;
      if (value && typeof value === 'number') return String(value);
    }
    return '';
  }

  // Helper para obtener valor numérico
  private getNumberValue(row: ExcelRow, keys: string[]): number {
    for (const key of keys) {
      const value = row[key as keyof ExcelRow];
      if (value !== undefined && value !== null) {
        const num = typeof value === 'number' ? value : parseFloat(String(value));
        if (!isNaN(num)) return num;
      }
    }
    return 0;
  }

  // Helper para obtener valor booleano
  private getBooleanValue(row: ExcelRow, keys: string[]): boolean {
    for (const key of keys) {
      const value = row[key as keyof ExcelRow];
      if (value !== undefined && value !== null) {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
          const lower = value.toLowerCase();
          if (lower === 'true' || lower === '1' || lower === 'si') return true;
          if (lower === 'false' || lower === '0' || lower === 'no') return false;
        }
        if (typeof value === 'number') return value === 1;
      }
    }
    return false;
  }

  // IMPORTAR PRODUCTOS DESDE EXCEL
  async importFromExcel(fileBuffer: Buffer): Promise<{ imported: number; updated: number; errors: string[]; total: number; categoriesCreated: string[] }> {
    try {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];

      let imported = 0;
      let updated = 0;
      const errors: string[] = [];
      const categoriesCreated: string[] = [];

      const validSizes = Object.values(ProductSize);
      const validProductTypes = Object.values(ProductType);

      // Obtener categorías existentes antes de empezar para no crear duplicados
      const existingCategories = await this.categoriesService.findAll();
      const existingCategoryNames = new Set(existingCategories.map(c => c.name.toLowerCase()));

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          // OBTENER NOMBRE DE CATEGORÍA
          let categoryName = this.getStringValue(row, ['category', 'Categoria']);

          // Si no hay nombre de categoría, usar el productType
          if (!categoryName) {
            const productTypeValue = this.getStringValue(row, ['productType', 'Tipo']).toLowerCase();
            const categoryMap: Record<string, string> = {
              corporativo: 'Corporativo',
              industrial: 'Industrial',
              bordados: 'Bordados',
              equipos: 'Equipos Trabajo'
            };
            categoryName = categoryMap[productTypeValue] || 'Corporativo';
          }

          // Limpiar y capitalizar
          categoryName = categoryName.trim();
          categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();

          // Obtener o crear la categoría
          let categoryId: string;
          try {
            categoryId = await this.getOrCreateCategory(categoryName);

            // Verificar si fue creada ahora
            if (!existingCategoryNames.has(categoryName.toLowerCase())) {
              if (!categoriesCreated.includes(categoryName)) {
                categoriesCreated.push(categoryName);
              }
            }
          } catch (catError) {
            errors.push(`Fila ${i + 2}: Error con categoría "${categoryName}" - ${catError.message}`);
            continue;
          }

          // Validar referencia
          const reference = this.getStringValue(row, ['reference', 'Referencia']);
          if (!reference) {
            errors.push(`Fila ${i + 2}: Se requiere referencia única del producto`);
            continue;
          }

          // Validar nombre
          const name = this.getStringValue(row, ['name', 'Nombre']);
          if (!name) {
            errors.push(`Fila ${i + 2}: Se requiere nombre del producto`);
            continue;
          }

          // Validar productType
          let productTypeValue = this.getStringValue(row, ['productType', 'Tipo']).toLowerCase();
          if (!validProductTypes.includes(productTypeValue as ProductType)) {
            productTypeValue = ProductType.CORPORATIVO;
          }
          const productType = productTypeValue as ProductType;

          // Procesar tallas
          let sizes: ProductSize[] = [ProductSize.S, ProductSize.M, ProductSize.L];
          const sizesStr = this.getStringValue(row, ['sizes']);
          if (sizesStr) {
            const sizeStrings = sizesStr.split(',').map(s => s.trim().toUpperCase());
            const validSizeStrings = sizeStrings.filter(s => validSizes.includes(s as ProductSize));
            if (validSizeStrings.length > 0) {
              sizes = validSizeStrings as ProductSize[];
            }
          }

          // Procesar colores
          let colors: string[] = [];
          const colorsStr = this.getStringValue(row, ['colors']);
          if (colorsStr) {
            colors = colorsStr.split(',').map(c => c.trim());
          }

          // Procesar imágenes
          let images: string[] = [];
          const imagesStr = this.getStringValue(row, ['images']);
          if (imagesStr) {
            images = imagesStr.split(',').map(i => i.trim());
          }

          // Procesar características
          let features: string[] = [];
          const featuresStr = this.getStringValue(row, ['features']);
          if (featuresStr) {
            features = featuresStr.split('|').map(f => f.trim());
          }

          // Procesar embroidery
          let embroidery: { included: boolean; maxStitches: number; colors: number; positions: string[] } | undefined = undefined;
          const embroideryIncluded = this.getBooleanValue(row, ['embroideryIncluded']);
          if (embroideryIncluded) {
            embroidery = {
              included: true,
              maxStitches: this.getNumberValue(row, ['embroideryMaxStitches']) || 15000,
              colors: this.getNumberValue(row, ['embroideryColors']) || 6,
              positions: this.getStringValue(row, ['embroideryPositions']) ?
                this.getStringValue(row, ['embroideryPositions']).split(',').map(p => p.trim()) :
                ['Pecho izquierdo'],
            };
          }

          const productData: CreateProductDto = {
            name: name,
            description: this.getStringValue(row, ['description', 'Descripción']),
            reference: reference,
            price: this.getNumberValue(row, ['price', 'Precio']),
            comparePrice: this.getNumberValue(row, ['comparePrice']) || undefined,
            productType: productType,
            categoryId: categoryId,
            subcategory: this.getStringValue(row, ['subcategory', 'Subcategoria']) || undefined,
            sizes: sizes,
            colors: colors,
            material: this.getStringValue(row, ['material']) || undefined,
            weight: this.getStringValue(row, ['weight']) || undefined,
            stock: this.getNumberValue(row, ['stock']),
            minOrder: this.getNumberValue(row, ['minOrder']) || 10,
            imageUrl: this.getStringValue(row, ['imageUrl']) || undefined,
            images: images,
            isActive: this.getBooleanValue(row, ['isActive']) !== false,
            isNew: this.getBooleanValue(row, ['isNew']),
            isFeatured: this.getBooleanValue(row, ['isFeatured']),
            hasDiscount: this.getBooleanValue(row, ['hasDiscount']),
            discount: this.getNumberValue(row, ['discount']),
            reinforcement: this.getBooleanValue(row, ['reinforcement']),
            reflective: this.getBooleanValue(row, ['reflective']),
            thermal: this.getBooleanValue(row, ['thermal']),
            embroidery: embroidery,
            features: features,
          };

          // Verificar si el producto ya existe
          const existingProduct = await this.findByReference(reference);

          if (existingProduct) {
            await this.update(existingProduct.id, productData);
            updated++;
            this.logger.log(`Producto actualizado: ${name} (${reference})`);
          } else {
            await this.create(productData);
            imported++;
            this.logger.log(`Producto importado: ${name} (${reference})`);
          }

        } catch (error) {
          this.logger.error(`Error en fila ${i + 2}: ${error.message}`);
          errors.push(`Fila ${i + 2}: ${error.message}`);
        }
      }

      return {
        imported,
        updated,
        errors,
        total: data.length,
        categoriesCreated
      };

    } catch (error) {
      this.logger.error(`Error al procesar archivo Excel: ${error.message}`);
      throw new Error(`Error al procesar el archivo: ${error.message}`);
    }
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