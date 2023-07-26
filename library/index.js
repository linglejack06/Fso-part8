/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const mongoose = require("mongoose");
const { GraphQLError } = require("graphql");
const Book = require("./models/book");
const Author = require("./models/author");
require("dotenv").config();

const { MONGODB_URI } = process.env;
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to database"))
  .catch((error) => console.error(error));

const typeDefs = `
  type Book {
    title: String!
    author: Author!
    published: Int!
    id: ID!
    genres: [String!]!
  }
  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]!
    ): Book
    editAuthor(
      name: String!
      born: Int!
    ): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: () => (Book.collection.length ? Book.collection.length : 0),
    authorCount: () =>
      Author.collection.length ? Author.collection.length : 0,
    allBooks: async (root, args) => {
      const books = await Book.find({});
      if (args.author && args.genre) {
        const authorBooks = books.filter((book) => book.author === args.author);
        return authorBooks.filter((book) => {
          if (book.genres.find((genre) => genre === args.genre)) {
            return true;
          }
          return false;
        });
      }
      if (args.author) {
        return books.filter((book) => book.author === args.author);
      }
      if (args.genre) {
        const genreBooks = Book.find({ genres: args.genre });
        return genreBooks;
      }
      return books;
    },
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
  },
  Author: {
    // bookCount: (root) => {
    //   console.log(root);
    //   const authorBooks = books.filter((book) => book.author === root.name);
    //   return authorBooks.length;
    // },
  },
  Mutation: {
    addBook: async (root, args) => {
      const author = Author.find({ name: args.author });
      let book;
      if (!author) {
        const newAuthor = new Author({ name: args.author, born: null });
        await newAuthor.save();
        book = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: newAuthor._id,
        });
      } else {
        book = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: author._id,
        });
      }
      try {
        await book.save();
        return book;
      } catch (error) {
        console.error(error);
        throw new GraphQLError("Error saving book", {
          error,
        });
      }
    },
    // editAuthor: (root, args) => {
    //   const author = authors.find((a) => a.name === args.name);
    //   if (!author) return null;
    //   const updatedAuthor = {
    //     ...author,
    //     born: args.born,
    //   };
    //   authors = authors.map((a) => (a.name === args.name ? updatedAuthor : a));
    //   return updatedAuthor;
    // },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(url);
});
