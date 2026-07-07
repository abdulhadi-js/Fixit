import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCategory } from './service-category.entity';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceCategory)
    private readonly serviceRepo: Repository<ServiceCategory>,
  ) {}

  findAll(): Promise<ServiceCategory[]> {
    return this.serviceRepo.find();
  }

  async findOne(id: string): Promise<ServiceCategory> {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) throw new NotFoundException(`Service ${id} not found`);
    return service;
  }

  create(dto: CreateServiceDto): Promise<ServiceCategory> {
    const service = this.serviceRepo.create(dto);
    return this.serviceRepo.save(service);
  }

  async update(id: string, dto: UpdateServiceDto): Promise<ServiceCategory> {
    await this.findOne(id); // throws if not found
    await this.serviceRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.serviceRepo.delete(id);
    return { message: `Service ${id} deleted` };
  }
}
