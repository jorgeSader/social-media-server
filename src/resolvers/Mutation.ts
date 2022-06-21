import { Post } from '@prisma/client';
import { Context } from '../server';

interface PostCreateArgs {
  title: string;
  content: string;
}

interface PostPayloadType {
  userErrors: {
    message: string;
  }[];
  post: Post | null;
}

export const Mutation = {
  postCreate: async (
    _parent: any,
    { title, content }: PostCreateArgs,
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    if (!title || !content) {
      return {
        userErrors: [
          {
            message: 'Title and content are required to create a post!',
          },
        ],
        post: null,
      };
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: 'cl4ngv7680117c9g0e1t9copg',
      },
    });

    return {
      userErrors: [],
      post,
    };
  },
};
