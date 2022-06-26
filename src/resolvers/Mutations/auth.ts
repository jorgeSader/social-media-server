import { User, Prisma } from '@prisma/client';
import { Context } from '../../server';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../keys';

interface SignupArgs {
  user: {
    name: string;
    email: string;
    password: string;
    bio: string;
  };
}
interface SigninArgs {
  user: {
    email: string;
    password: string;
  };
}

interface UserPayload {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const authResolvers = {
  userSignup: async (
    _parent: any,
    { user }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { name, email, password, bio } = user;

    const isEmail = validator.isEmail(email);

    if (!isEmail) {
      return {
        userErrors: [
          {
            message: 'Invalid Email! Please enter a valid email.',
          },
        ],
        token: null,
      };
    }

    const isPassword = validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });

    if (!isPassword) {
      return {
        userErrors: [
          {
            message:
              'Invalid Password! Password must be at least 8 characters long and have at least: 1 uppercase, 1 lowercase, 1 number, and a symbol.',
          },
        ],
        token: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    await prisma.profile.create({
      data: {
        bio: bio,
        userId: newUser.id,
      },
    });

    const token = jwt.sign(
      {
        userId: newUser.id,
      },
      JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    return {
      userErrors: [],
      token,
    };
  },

  userSignin: async (
    _parent: any,
    { user }: SigninArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = user;

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userExists) {
      return {
        userErrors: [
          {
            message: 'Invalid Email! Please enter a valid email.',
          },
        ],
        token: null,
      };
    }

    const isPassword = await bcrypt.compare(password, userExists.password);

    if (!isPassword) {
      return {
        userErrors: [
          {
            message: 'Invalid Password! Please enter a valid password.',
          },
        ],
        token: null,
      };
    }

    const token = jwt.sign(
      {
        userId: userExists.id,
      },
      JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    return {
      userErrors: [],
      token,
    };
  },
};
