import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../users/user.entity';

export async function seedTestUsers(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(User);
  const password_hash = await bcrypt.hash('SecurePass123', 12);

  const testConsumer = {
    full_name: 'Test Consumer',
    phone_number: '+923000000001',
    password_hash,
    role: UserRole.CONSUMER,
    is_verified: true,
  };

  const testTechnician = {
    full_name: 'Test Technician',
    phone_number: '+923100000002',
    password_hash,
    role: UserRole.TECHNICIAN,
    is_verified: true,
  };

  for (const userData of [testConsumer, testTechnician]) {
    const exists = await repo.findOne({ where: { phone_number: userData.phone_number } });
    if (!exists) {
      await repo.save(repo.create(userData));
    }
  }

  console.log('✅ Seeded pre-verified test users');
}
