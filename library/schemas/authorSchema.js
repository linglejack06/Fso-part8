const { GraphQLError } = require("graphql");
const Author = require("../models/author");

const authorTypeDef = `
extend type Query {
  allAuthors: [Author!]!
  authorCount: Int!
}
type Author {
  name: String!
  born: Int
  id: ID!
  bookCount: Int!
}
`;
const authorResolvers = {
  Author: {},
  Query: {
    allAuthors: async () => {
      try {
        const authors = Author.find({});
        return authors;
      } catch (error) {
        throw new GraphQLError("Error loading authors", {
          error,
        });
      }
    },
    authorCount: () =>
      Author.collection.length ? Author.collection.length : 0,
  },
};

module.exports = { authorResolvers, authorTypeDef };
