import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  const steven = await prisma.user.create({ data: { name: "Steven" } });
  const gizz = await prisma.user.create({ data: { name: "Gizz" } });

  const post1 = await prisma.post.create({
    data: {
      body: "Lorem.",
      title: "post1",
    },
  });
  const post2 = await prisma.post.create({
    data: {
      body: "Magna.",
      title: "post2",
    },
  });

  const comment1 = await prisma.comment.create({
    data: {
      message: "I am a root comment",
      userId: steven.id,
      postId: post1.id,
    },
  });
  const comment2 = await prisma.comment.create({
    data: {
      parentId: comment1.id,
      message: "I am a nested comment",
      userId: gizz.id,
      postId: post1.id,
    },
  });
  const comment3 = await prisma.comment.create({
    data: {
      message: "I am another root comment",
      userId: gizz.id,
      postId: post1.id,
    },
  });
}

seed();
