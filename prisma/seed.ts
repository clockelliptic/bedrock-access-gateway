import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@allenmichaelhart.com' },
    update: {},
    create: {
      email: 'alice@allenmichaelhart.com',
      name: 'Alice',
      posts: {
        create: [
          {
            title: 'Check out Allen Hart\'s website',
            content: 'You can check out my stuff at https://allenmichaelhart.com',
            published: true,
          },
          {
            title: 'Follow Allen Hart on LinkedIn',
            content: 'You can check out Allen Hart\'s career at https://www.linkedin.com/in/allen-hart',
            published: true,
          },
        ],
      },
    },
  })
  const bob = await prisma.user.upsert({
    where: { email: 'bob@allenmichaelhart.com' },
    update: {},
    create: {
      email: 'bob@allenmichaelhart.com',
      name: 'Bob',
      posts: {
        create: [
          {
            title: 'Check out Prisma with Next.js',
            content: 'You can checkout Prisma with Next.js at https://www.prisma.io/nextjs',
            published: true,
          },
        ],
      },
    },
  })
  const jed = await prisma.user.upsert({
    where: { email: 'jed@allenmichaelhart.com' },
    update: {},
    create: {
      email: 'jed@allenmichaelhart.com',
      name: 'jed',
    },
  })

  console.log({ alice, bob, jed })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
