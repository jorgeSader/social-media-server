import { Context } from '../server';

interface PostParentType {
  authorId: string;
}

export const Post = {
  user: (parent: PostParentType, _args: any, { userInfo, prisma }: Context) => {
    // if (!userInfo) {
    //   return null;
    // }

    return prisma.user.findUnique({
      where: {
        id: parent.authorId,
      },
    });
  },
};
