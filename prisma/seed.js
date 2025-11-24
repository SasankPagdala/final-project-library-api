import bcrypt from 'bcrypt';
import prisma from '../src/config/db.js';

async function main() {
  console.log('Seeding database...');

  //Clear tables in proper order
  await prisma.listShare.deleteMany();
  await prisma.listItem.deleteMany();
  await prisma.list.deleteMany();
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  //Create users
  const adminPasswordHash = await bcrypt.hash('AdminPass123!', 10);
  const userPasswordHash = await bcrypt.hash('UserPass123!', 10);

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      username: 'johndoe',
      email: 'john@example.com',
      passwordHash: userPasswordHash,
      role: 'USER',
    },
  });

  console.log('Created users:', { adminId: admin.id, userId: regularUser.id });

  //Categories
  const categoriesData = [
    { name: 'Produce', description: 'Fresh fruits and vegetables', displayOrder: 1 },
    { name: 'Dairy', description: 'Milk, cheese, yogurt', displayOrder: 2 },
    { name: 'Pantry', description: 'Shelf-stable pantry items', displayOrder: 3 },
  ];

  const categories = [];
  for (const data of categoriesData) {
    const category = await prisma.category.create({ data });
    categories.push(category);
  }

  console.log('Created categories:', categories.map(c => c.name));

  //Items (linked to categories)
  const itemsData = [
    {
      name: 'Bananas',
      defaultUnit: 'bunch',
      categoryId: categories.find(c => c.name === 'Produce').id,
    },
    {
      name: 'Spinach',
      defaultUnit: 'bag',
      categoryId: categories.find(c => c.name === 'Produce').id,
    },
    {
      name: 'Milk',
      defaultUnit: 'gallon',
      categoryId: categories.find(c => c.name === 'Dairy').id,
    },
    {
      name: 'Cheddar Cheese',
      defaultUnit: 'block',
      categoryId: categories.find(c => c.name === 'Dairy').id,
    },
    {
      name: 'Pasta',
      defaultUnit: 'box',
      categoryId: categories.find(c => c.name === 'Pantry').id,
    },
  ];

  const items = [];
  for (const data of itemsData) {
    const item = await prisma.item.create({ data });
    items.push(item);
  }

  console.log('Created items:', items.map(i => i.name));

  //Lists (one for admin, one for user)
  const adminList = await prisma.list.create({
    data: {
      ownerId: admin.id,
      name: 'Admin Weekly Groceries',
      description: 'Main household groceries (admin)',
      isActive: true,
    },
  });

  const userList = await prisma.list.create({
    data: {
      ownerId: regularUser.id,
      name: 'John’s Dinner Party',
      description: 'Ingredients for Saturday dinner',
      isActive: true,
    },
  });

  console.log('Created lists:', { adminListId: adminList.id, userListId: userList.id });

  //List items
  await prisma.listItem.createMany({
    data: [
      //Admin list
      {
        listId: adminList.id,
        itemId: items.find(i => i.name === 'Bananas').id,
        quantity: 2,
        unit: 'bunches',
        isPurchased: false,
        notes: 'Ripe but not brown',
      },
      {
        listId: adminList.id,
        itemId: items.find(i => i.name === 'Milk').id,
        quantity: 1,
        unit: 'gallon',
        isPurchased: false,
        notes: '2% milk',
      },

      //User list
      {
        listId: userList.id,
        itemId: items.find(i => i.name === 'Pasta').id,
        quantity: 3,
        unit: 'boxes',
        isPurchased: false,
        notes: 'Any brand',
      },
      {
        listId: userList.id,
        itemId: items.find(i => i.name === 'Cheddar Cheese').id,
        quantity: 2,
        unit: 'blocks',
        isPurchased: false,
        notes: 'Sharp cheddar',
      },
    ],
  });

  console.log('Created list items.');

  console.log('Database seeded successfully!');
  console.log('Admin login:    admin@example.com / AdminPass123!');
  console.log('Regular login:  john@example.com  / UserPass123!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
