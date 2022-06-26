import { Post, Prisma } from '@prisma/client';
import { Context } from '../../server';
import { canUserMutatePost } from '../../utils/canUserMutatePost';

interface PostArgs {
  post: {
    title?: string;
    content?: string;
  };
}

interface PostPayloadType {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postResolvers = {
  postCreate: async (
    _parent: any,
    { post }: PostArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'You must be logged in to create a post.',
          },
        ],
        post: null,
      };
    }

    const { title, content } = post;
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

    return {
      userErrors: [],
      post: prisma.post.create({
        data: {
          title,
          content,
          authorId: userInfo.userId,
        },
      }),
    };
  },

  postUpdate: async (
    _parent: any,
    { post, postId }: { postId: string; post: PostArgs['post'] },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'You must be logged in to update a post.',
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: postId,
      prisma,
    });

    if (error) return error;

    const { title, content } = post;
    if (!title && !content) {
      return {
        userErrors: [
          {
            message: 'Title or content are required to update a post!',
          },
        ],
        post: null,
      };
    }

    const existingPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!existingPost) {
      return {
        userErrors: [
          {
            message: 'Post not found!',
          },
        ],
        post: null,
      };
    }

    let PayloadToUpdate = {
      title,
      content,
    };
    if (!title) {
      delete PayloadToUpdate.title;
    }
    if (!content) {
      delete PayloadToUpdate.content;
    }

    return {
      userErrors: [],
      post: prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          ...PayloadToUpdate,
        },
      }),
    };
  },

  postDelete: async (
    _parent: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    const existingPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!existingPost) {
      return {
        userErrors: [
          {
            message: 'Post not found!',
          },
        ],
        post: null,
      };
    }

    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'You must be logged in to update a post.',
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: postId,
      prisma,
    });

    if (error) return error;

    return {
      userErrors: [],
      post: prisma.post.delete({
        where: {
          id: postId,
        },
      }),
    };
  },
};
