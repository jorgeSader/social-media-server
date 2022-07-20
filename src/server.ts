import { ApolloServer, gql } from 'apollo-server';
import { typeDefs } from './schema';
import { Query, Mutation, Profile } from './resolvers';
import { PrismaClient, Prisma } from '@prisma/client';
import { getUserFromToken } from './utils/getUserFromToken';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  userInfo: {
    userId: string;
  } | null;
}
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Profile,
  },
  context: async ({ req }) => {
    const token = (await req.headers.authorization) || '';
    const userInfo = await getUserFromToken(token);
    return {
      prisma,
      userInfo,
    };
  },

  //   context: async ({ req }: any): Promise<Context> => {
  //     const token = (await req.headers.authorization) || '';
  //     const userInfo = getUserFromToken(token);
  //     return {
  //       prisma,
  //       userInfo,
  //     };
  //   },
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
