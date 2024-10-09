'use server';
import prisma from "@/prisma/client";

export const getAllAuthors = (async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  });
});
