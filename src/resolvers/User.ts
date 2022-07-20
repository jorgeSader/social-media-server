import { Context } from '../server';

interface UserParentType {
  id: string;
}

export const User = {
  posts: (
    parent: UserParentType,
    _args: any,
    { userInfo, prisma }: Context
  ) => {
    const isOwnUser = parent.id === userInfo?.userId;

    if (isOwnUser) {
      return prisma.post.findMany({
        where: {
          authorId: parent.id,
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      });
    }

    return prisma.post.findMany({
      where: {
        authorId: parent.id,
        published: true,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
  },
};
