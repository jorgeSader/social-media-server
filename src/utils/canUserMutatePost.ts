import { Context } from '../server';

interface canUserMutatePostParams {
  postId: string;
  userId: string;
  prisma: Context['prisma'];
}

export const canUserMutatePost = async ({
  userId,
  postId,
  prisma,
}: canUserMutatePostParams) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return {
      userErrors: [
        {
          message: 'User not found!',
        },
      ],
      post: null,
    };
  }

  const postToUpdate = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (postToUpdate?.authorId !== user.id) {
    return {
      userErrors: [
        {
          message: 'You are not authorized to modify this post!',
        },
      ],
      post: null,
    };
  }
};
