import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { googleId },
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { resetToken: token },
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    await this.usersRepository.update(id, userData);
    return this.findById(id);
  }

  // ✅ NUEVO MÉTODO: Actualizar rol de usuario
  async updateRole(id: string, role: UserRole): Promise<User | null> {
    await this.usersRepository.update(id, { role });
    return this.findById(id);
  }

  async findOrCreateByGoogle(profile: {
    googleId: string;
    email: string;
    name: string;
    photoUrl: string;
  }): Promise<User> {
    let user = await this.findByGoogleId(profile.googleId);

    if (user) {
      return user;
    }

    user = await this.findByEmail(profile.email);

    if (user) {
      await this.update(user.id, {
        googleId: profile.googleId,
        photoUrl: profile.photoUrl,
      });
      return this.findById(user.id) as Promise<User>;
    }

    // Usar el enum UserRole.CLIENT
    return this.create({
      googleId: profile.googleId,
      email: profile.email,
      name: profile.name,
      photoUrl: profile.photoUrl,
      password: null,
      isActive: true,
      role: UserRole.CLIENT, // Cambiar a CLIENT (no a string)
    });
  }
}