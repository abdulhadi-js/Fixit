import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByPhone(phone_number: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { phone_number } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async findByIdOrFail(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async save(user: Partial<User>): Promise<User> {
    return this.userRepo.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    await this.userRepo.update(id, data);
  }

  /**
   * Explicitly fetches refresh_token_hash (excluded from default selects via `select: false`).
   * Used during token rotation to validate the incoming refresh token.
   */
  async findByIdWithRefreshToken(id: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.refresh_token_hash')
      .where('user.id = :id', { id })
      .getOne();
  }
}
