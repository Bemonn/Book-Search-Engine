const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # This is a comment in GraphQL
  # Define your types here
  type Book {
    bookId: String!
    authors: [String]!
    description: String!
    title: String!
    image: String
    link: String
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Auth {
    token: ID!
    user: User
  }

  # Inputs are special types that allow you to pass objects
  input BookInput {
    bookId: String!
    authors: [String]!
    description: String!
    title: String!
    image: String
    link: String
  }

  # Define the Query type
  type Query {
    me: User
  }

  # Define Mutation type
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;