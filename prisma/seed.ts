import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@medispa.com' },
    update: {},
    create: {
      email: 'admin@medispa.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create staff user
  const staffPassword = await hash('staff123', 12)
  const staff = await prisma.user.upsert({
    where: { email: 'staff@medispa.com' },
    update: {},
    create: {
      email: 'staff@medispa.com',
      name: 'Staff User',
      password: staffPassword,
      role: 'STAFF',
    },
  })

  // Create services
  const facial = await prisma.service.upsert({
    where: { name: 'Facial Treatment' },
    update: {},
    create: {
      name: 'Facial Treatment',
      description: 'Rejuvenating facial treatment for all skin types',
      duration: 60,
      price: 89.99,
    },
  })

  const massage = await prisma.service.upsert({
    where: { name: 'Therapeutic Massage' },
    update: {},
    create: {
      name: 'Therapeutic Massage',
      description: 'Full body massage therapy',
      duration: 90,
      price: 129.99,
    },
  })

  // Create clients
  const client1 = await prisma.client.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {
      phone: '555-0123',
    },
    create: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '555-0123',
      dob: new Date('1990-05-15'),
      gender: 'Female',
      occupation: 'Software Engineer',
      maritalStatus: 'Single',
      referredBy: 'Google Search',
      consultant: 'Dr. Sarah',
      notes: 'Prefers evening appointments',
      balance: 250.00,
      skinAssessment: {
        create: {
          skinType: 'Combination',
          skinTexture: 'Normal',
          skinTone: 'Medium',
          treatments: ['Laser', 'Chemical Peel']
        }
      },
      treatmentRecords: {
        create: [
          {
            date: new Date('2024-03-15'),
            staffName: 'Dr. Sarah',
            totalAmount: 628.00,
            notes: '500 credits, $128 paid',
            treatments: {
              create: [
                { name: 'Laser - Face', price: 468.00 },
                { name: 'Laser - Eye', price: 160.00 }
              ]
            }
          },
          {
            date: new Date('2024-02-15'),
            staffName: 'Dr. Sarah',
            totalAmount: 500.00,
            notes: '$500 paid',
            treatments: {
              create: [
                { name: 'Laser - Face', price: 468.00 },
                { name: 'Laser - Mask', price: 32.00 }
              ]
            }
          }
        ]
      }
    },
  })

  const client2 = await prisma.client.upsert({
    where: { email: 'john.doe@example.com' },
    update: {
      phone: '555-0124',
    },
    create: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '555-0124',
      dob: new Date('1985-08-22'),
      gender: 'Male',
      occupation: 'Marketing Manager',
      maritalStatus: 'Married',
      referredBy: 'Friend',
      consultant: 'Dr. Michael',
      notes: 'Allergic to certain oils',
      balance: 0.00,
      skinAssessment: {
        create: {
          skinType: 'Dry',
          skinTexture: 'Fine',
          skinTone: 'Light',
          treatments: ['Microdermabrasion', 'Botox']
        }
      },
      treatmentRecords: {
        create: [
          {
            date: new Date('2024-03-20'),
            staffName: 'Dr. Michael',
            totalAmount: 660.00,
            notes: '$660 paid',
            treatments: {
              create: [
                { name: 'Laser - Face', price: 468.00 },
                { name: 'Laser - Eye', price: 160.00 },
                { name: 'Mask', price: 32.00 }
              ]
            }
          }
        ]
      }
    },
  })

  // Create appointments
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(10, 0, 0, 0)

  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  nextWeek.setHours(14, 0, 0, 0)

  await prisma.appointment.createMany({
    data: [
      {
        startTime: tomorrow,
        endTime: new Date(tomorrow.getTime() + 60 * 60 * 1000),
        status: 'BOOKED',
        clientId: client1.id,
        serviceId: facial.id,
        staffId: staff.id,
        notes: 'First time client',
      },
      {
        startTime: nextWeek,
        endTime: new Date(nextWeek.getTime() + 90 * 60 * 1000),
        status: 'CONFIRMED',
        clientId: client2.id,
        serviceId: massage.id,
        staffId: staff.id,
      },
    ],
  })

  console.log('Database has been seeded. 🌱')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 