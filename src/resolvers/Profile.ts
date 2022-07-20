import { Context } from '../server';

interface ProfileParentType {
  id: string;
  bio: string;
  userId: string;
}

export const Profile = {
  user: (
    parent: ProfileParentType,
    _args: any,
    { userInfo, prisma }: Context
  ) => {
    // if (!userInfo) {
    //   return null;
    // }

    return prisma.user.findUnique({
      where: {
        id: parent.userId,
      },
    });
  },
};
