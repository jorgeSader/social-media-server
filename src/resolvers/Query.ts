import { Context } from '../server';

export const Query = {
  posts: async (_parent: any, _args: any, { prisma }: Context) => {
    return await prisma.post.findMany({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
  },
};
