import { Context } from '../../server';
import validator from 'validator';

interface SignupArgs {
  user: {
    name: string;
    email: string;
    password: string;
    bio: string;
  };
}

interface AuthPayload {
  userErrors: {
    message: string;
  }[];
  user: null;
}

export const authResolvers = {
  userSignup: async (
    _parent: any,
    { user }: SignupArgs,
    { prisma }: Context
  ) => {
    const { name, email, password, bio } = user;

    // const isEmail = validator.isEmail(email);

    // if (!isEmail) {
    //   return {
    //     userErrors: [
    //       {
    //         message: 'Invalid Email! Please enter a valid email.',
    //       },
    //     ],
    //     user: null,
    //   };
    // }
    // return {
    //   userErrors: [],
    //   user: null,
    // };

    prisma.user.create({
      data: {
        name,
        email,
        password,
        // bio: bio || '',
      },
    });
  },
};
