import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('dwight91#!', 10);

  await prisma.users.deleteMany();

  await prisma.users.create({
    data: {
      email: 'rakximov.dev@gmail.com',
      passwordHash: passwordHash,
      isActive: true,
      isAdmin: true,
      isVerified: true,
      username: "Abrorbek"
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });