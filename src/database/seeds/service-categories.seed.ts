import { DataSource } from 'typeorm';
import { ServiceCategory } from '../../services/service-category.entity';

export const serviceCategories: Partial<ServiceCategory>[] = [
  // ── Electrical ───────────────────────────────────────────────────────────
  {
    title: 'Electrical Wiring & Rewiring',
    base_price: 3500,
    estimated_duration_mins: 120,
    metadata: {
      icon: 'electrical',
      tags: ['wiring', 'rewiring', 'electrical'],
      requires_parts: true,
      warranty_days: 30,
    },
  },
  {
    title: 'Switchboard & Socket Installation',
    base_price: 1200,
    estimated_duration_mins: 45,
    metadata: {
      icon: 'electrical',
      tags: ['switch', 'socket', 'outlet'],
      requires_parts: true,
      warranty_days: 30,
    },
  },
  {
    title: 'MCB / Fuse Box Repair',
    base_price: 2000,
    estimated_duration_mins: 60,
    metadata: {
      icon: 'electrical',
      tags: ['mcb', 'fuse', 'circuit breaker'],
      requires_parts: true,
      warranty_days: 30,
    },
  },
  {
    title: 'Ceiling Fan Installation',
    base_price: 800,
    estimated_duration_mins: 30,
    metadata: {
      icon: 'electrical',
      tags: ['fan', 'ceiling fan', 'installation'],
      requires_parts: false,
      warranty_days: 7,
    },
  },
  {
    title: 'Inverter / UPS Installation',
    base_price: 2500,
    estimated_duration_mins: 90,
    metadata: {
      icon: 'electrical',
      tags: ['inverter', 'ups', 'backup power'],
      requires_parts: true,
      warranty_days: 30,
    },
  },

  // ── Plumbing ─────────────────────────────────────────────────────────────
  {
    title: 'Tap & Faucet Repair / Replacement',
    base_price: 700,
    estimated_duration_mins: 30,
    metadata: {
      icon: 'plumbing',
      tags: ['tap', 'faucet', 'leakage'],
      requires_parts: true,
      warranty_days: 14,
    },
  },
  {
    title: 'Pipe Leakage Repair',
    base_price: 1500,
    estimated_duration_mins: 60,
    metadata: {
      icon: 'plumbing',
      tags: ['pipe', 'leakage', 'water'],
      requires_parts: true,
      warranty_days: 30,
    },
  },
  {
    title: 'Bathroom Fitting Installation',
    base_price: 2500,
    estimated_duration_mins: 90,
    metadata: {
      icon: 'plumbing',
      tags: ['bathroom', 'fitting', 'toilet', 'shower'],
      requires_parts: true,
      warranty_days: 30,
    },
  },
  {
    title: 'Water Motor / Pump Repair',
    base_price: 2000,
    estimated_duration_mins: 75,
    metadata: {
      icon: 'plumbing',
      tags: ['motor', 'pump', 'water supply'],
      requires_parts: true,
      warranty_days: 30,
    },
  },
  {
    title: 'Drain Unblocking & Cleaning',
    base_price: 1200,
    estimated_duration_mins: 45,
    metadata: {
      icon: 'plumbing',
      tags: ['drain', 'blocked', 'cleaning'],
      requires_parts: false,
      warranty_days: 7,
    },
  },

  // ── AC & Cooling ─────────────────────────────────────────────────────────
  {
    title: 'AC Installation (Split Unit)',
    base_price: 3500,
    estimated_duration_mins: 180,
    metadata: {
      icon: 'ac',
      tags: ['ac', 'split', 'installation', 'cooling'],
      requires_parts: true,
      warranty_days: 30,
    },
  },
  {
    title: 'AC Gas Refilling',
    base_price: 4500,
    estimated_duration_mins: 60,
    metadata: {
      icon: 'ac',
      tags: ['ac', 'gas', 'refrigerant', 'cooling'],
      requires_parts: true,
      warranty_days: 30,
    },
  },
  {
    title: 'AC Service & Deep Cleaning',
    base_price: 2500,
    estimated_duration_mins: 90,
    metadata: {
      icon: 'ac',
      tags: ['ac', 'service', 'cleaning', 'maintenance'],
      requires_parts: false,
      warranty_days: 14,
    },
  },
  {
    title: 'AC PCB / Compressor Repair',
    base_price: 5000,
    estimated_duration_mins: 120,
    metadata: {
      icon: 'ac',
      tags: ['ac', 'pcb', 'compressor', 'repair'],
      requires_parts: true,
      warranty_days: 30,
    },
  },

  // ── Appliance Repair ─────────────────────────────────────────────────────
  {
    title: 'Washing Machine Repair',
    base_price: 2500,
    estimated_duration_mins: 90,
    metadata: {
      icon: 'appliance',
      tags: ['washing machine', 'laundry', 'repair'],
      requires_parts: true,
      warranty_days: 30,
    },
  },
  {
    title: 'Refrigerator Repair',
    base_price: 2000,
    estimated_duration_mins: 75,
    metadata: {
      icon: 'appliance',
      tags: ['refrigerator', 'fridge', 'cooling', 'repair'],
      requires_parts: true,
      warranty_days: 30,
    },
  },
  {
    title: 'Microwave / Oven Repair',
    base_price: 1800,
    estimated_duration_mins: 60,
    metadata: {
      icon: 'appliance',
      tags: ['microwave', 'oven', 'kitchen', 'repair'],
      requires_parts: true,
      warranty_days: 14,
    },
  },
  {
    title: 'Geyser / Water Heater Repair',
    base_price: 1500,
    estimated_duration_mins: 60,
    metadata: {
      icon: 'appliance',
      tags: ['geyser', 'water heater', 'hot water', 'repair'],
      requires_parts: true,
      warranty_days: 30,
    },
  },

  // ── Painting & Renovation ────────────────────────────────────────────────
  {
    title: 'Interior Wall Painting (Per Room)',
    base_price: 8000,
    estimated_duration_mins: 480,
    metadata: {
      icon: 'painting',
      tags: ['painting', 'interior', 'wall', 'room'],
      requires_parts: true,
      warranty_days: 0,
    },
  },
  {
    title: 'Waterproofing & Seepage Treatment',
    base_price: 6000,
    estimated_duration_mins: 240,
    metadata: {
      icon: 'painting',
      tags: ['waterproofing', 'seepage', 'leakage', 'roof'],
      requires_parts: true,
      warranty_days: 90,
    },
  },

  // ── Carpentry & Furniture ────────────────────────────────────────────────
  {
    title: 'Door / Window Repair & Fitting',
    base_price: 2000,
    estimated_duration_mins: 90,
    metadata: {
      icon: 'carpentry',
      tags: ['door', 'window', 'fitting', 'carpentry'],
      requires_parts: true,
      warranty_days: 14,
    },
  },
  {
    title: 'Furniture Assembly & Repair',
    base_price: 1500,
    estimated_duration_mins: 60,
    metadata: {
      icon: 'carpentry',
      tags: ['furniture', 'assembly', 'repair', 'carpentry'],
      requires_parts: false,
      warranty_days: 7,
    },
  },

  // ── Cleaning ─────────────────────────────────────────────────────────────
  {
    title: 'Home Deep Cleaning (Full)',
    base_price: 7000,
    estimated_duration_mins: 300,
    metadata: {
      icon: 'cleaning',
      tags: ['cleaning', 'deep clean', 'home', 'sanitize'],
      requires_parts: false,
      warranty_days: 0,
    },
  },
  {
    title: 'Sofa & Upholstery Cleaning',
    base_price: 3000,
    estimated_duration_mins: 120,
    metadata: {
      icon: 'cleaning',
      tags: ['sofa', 'upholstery', 'cleaning', 'steam'],
      requires_parts: false,
      warranty_days: 0,
    },
  },
  {
    title: 'Carpet & Mattress Cleaning',
    base_price: 2500,
    estimated_duration_mins: 90,
    metadata: {
      icon: 'cleaning',
      tags: ['carpet', 'mattress', 'cleaning', 'steam'],
      requires_parts: false,
      warranty_days: 0,
    },
  },
];

export async function seedServiceCategories(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(ServiceCategory);

  for (const category of serviceCategories) {
    // Idempotent: skip if a category with the same title already exists
    const exists = await repo.findOne({ where: { title: category.title } });
    if (!exists) {
      await repo.save(repo.create(category));
    }
  }

  console.log(`✅ Seeded ${serviceCategories.length} service categories`);
}
