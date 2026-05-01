const prisma = require('./src/config/db');
const bcrypt = require('bcrypt');

async function main() {
  console.log('Cleaning up database...');
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.staffProfile.deleteMany();
  await prisma.user.deleteMany({ where: { role: { not: 'Admin' } } });

  console.log('Seeding dummy data...');

  // 1. Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tarix.com' },
    update: {},
    create: {
      email: 'admin@tarix.com',
      name: 'Super Admin',
      password: adminPassword,
      role: 'Admin',
    },
  });

  // 2. Create Ticketer
  const ticketerPassword = await bcrypt.hash('ticketer123', 10);
  const ticketer = await prisma.user.upsert({
    where: { email: 'ticketer@tarix.com' },
    update: {},
    create: {
      email: 'ticketer@tarix.com',
      name: 'John Ticketer',
      password: ticketerPassword,
      role: 'Ticketer',
      walletBalance: 10000,
    },
  });

  // 3. Create Buses
  const bus1 = await prisma.bus.create({
    data: {
      registrationNumber: 'LAG-001',
      chassisNumber: 'CH-001',
      engineNumber: 'EN-001',
      ownerName: 'Tarix Logistics',
      ownerPhone: '08011122233',
      manufacturer: 'Toyota',
      model: 'Hiace',
      year: 2022,
      color: 'White',
      fuelType: 'Petrol',
      totalCapacity: 14,
      availableSeats: 14,
      maintenanceStatus: 'Excellent',
      transmissionType: 'Manual',
    },
  });

  const bus2 = await prisma.bus.create({
    data: {
      registrationNumber: 'ABJ-002',
      chassisNumber: 'CH-002',
      engineNumber: 'EN-002',
      ownerName: 'Tarix Logistics',
      ownerPhone: '08011122233',
      manufacturer: 'Mercedes',
      model: 'Sprinter',
      year: 2023,
      color: 'Silver',
      fuelType: 'Diesel',
      totalCapacity: 22,
      availableSeats: 22,
      maintenanceStatus: 'Good',
      transmissionType: 'Automatic',
    },
  });

  // 4. Create Drivers
  const driver1 = await prisma.driver.create({
    data: {
      fullName: 'Ahmed Hassan',
      email: 'ahmed@driver.com',
      phone: '08012345678',
      licenseNumber: 'DL-12345',
      licenseExpiryDate: new Date('2026-12-31'),
      licenseIssueDate: new Date('2021-01-01'),
      yearsOfExperience: 5,
      homeAddress: 'Lagos, Nigeria',
      assignedBusId: bus1.id,
      employmentDate: new Date('2024-01-01'),
      monthlySalary: 75000,
      emergencyContactName: 'Fatima Hassan',
      emergencyContactPhone: '08087654321',
    },
  });

  // 5. Create Trips
  const trip1 = await prisma.trip.create({
    data: {
      departureTerminal: 'Lagos',
      arrivalTerminal: 'Ibadan',
      departureDate: new Date(),
      departureTime: '08:00 AM',
      price: 5000,
      availableSeats: 14,
      busId: bus1.id,
      driverId: driver1.id,
    },
  });

  const trip2 = await prisma.trip.create({
    data: {
      departureTerminal: 'Abuja',
      arrivalTerminal: 'Lagos',
      departureDate: new Date(Date.now() + 86400000), // Tomorrow
      departureTime: '10:00 AM',
      price: 15000,
      availableSeats: 22,
      busId: bus2.id,
      driverId: driver1.id,
    },
  });

  // 6. Create Bookings
  await prisma.booking.create({
    data: {
      userId: ticketer.id,
      tripId: trip1.id,
      seats: 1,
      totalPrice: 5000,
      paymentStatus: 'completed',
      status: 'confirmed',
    },
  });

  await prisma.booking.create({
    data: {
      userId: ticketer.id,
      tripId: trip1.id,
      seats: 1,
      totalPrice: 5000,
      paymentStatus: 'completed',
      status: 'confirmed',
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
