import { Context } from '../server';

export const Query = {
  me: (_parent: any, _args: any, { userInfo, prisma }: Context) => {
    if (!userInfo) {
      return null;
    }

    return prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    });
  },

  posts: async (_parent: any, _args: any, { prisma }: Context) => {
    return await prisma.post.findMany({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
  },
  profile: async (
    _parent: any,
    { userId }: { userId: string },
    { prisma }: Context
  ) => {
    return await prisma.profile.findUnique({
      where: {
        userId: userId,
      },
    });
  },
};
