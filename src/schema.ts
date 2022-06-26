import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    posts: [Post!]!
  }
  type Mutation {
    postCreate(post: PostInput!): PostPayload!
    postUpdate(postId: ID!, post: PostInput!): PostPayload!
    postDelete(postId: ID!): PostPayload!
    userSignup(user: UserInput!): AuthPayload!
    userSignin(user: UserSigninInput!): AuthPayload!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    profile: Profile!
    posts: [Post!]!
  }

  type Profile {
    id: ID!
    bio: String!
    user: User!
  }

  type UserError {
    message: String!
  }

  type PostPayload {
    userErrors: [UserError!]!
    post: Post
  }

  type AuthPayload {
    userErrors: [UserError!]!
    token: String
  }

  input PostInput {
    title: String
    content: String
  }

  input UserInput {
    name: String
    email: String!
    password: String!
    bio: String
  }

  input UserSigninInput {
    email: String!
    password: String!
  }
`;
