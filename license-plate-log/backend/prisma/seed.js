const path = require("path");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { password: passwordHash, role: "admin" },
    create: {
      email: "admin@example.com",
      password: passwordHash,
      name: "Default Admin",
      role: "admin",
    },
  });

  const existingPlates = await prisma.plate.count();
  if (existingPlates > 0) {
    console.log("Seed data created");
    return;
  }

  const samples = [
    {
      plateText: "ABC1234",
      confidence: 0.95,
      cameraId: "cam-01",
      notes: "Sample observation 1",
    },
    {
      plateText: "XYZ9876",
      confidence: 0.88,
      cameraId: "cam-02",
      notes: "Sample observation 2",
    },
    {
      plateText: "LMN4455",
      confidence: 0.92,
      cameraId: "cam-01",
      notes: "Sample observation 3",
    },
    {
      plateText: "QRS7788",
      confidence: 0.9,
      cameraId: "cam-03",
      notes: "Sample observation 4",
    },
    {
      plateText: "TUV1122",
      confidence: 0.87,
      cameraId: "cam-02",
      notes: "Sample observation 5",
    },
  ];

  for (const row of samples) {
    await prisma.plate.create({
      data: {
        ...row,
        userId: admin.id,
      },
    });
  }

  console.log("Seed data created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
