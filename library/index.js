/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const mongoose = require("mongoose");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
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
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
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
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: () => (Book.collection.length ? Book.collection.length : 0),
    authorCount: () =>
      Author.collection.length ? Author.collection.length : 0,
    allBooks: async (root, args) => {
      try {
        if (args.author && args.genre) {
          const books = await Book.find({ genres: args.genre }).populate(
            "author"
          );
          return books.filter((book) => book.author.name === args.author);
        }
        if (args.author) {
          const books = await Book.find({}).populate("author");
          return books.filter((book) => book.author.name === args.author);
        }
        if (args.genre) {
          const genreBooks = Book.find({ genres: args.genre });
          return genreBooks;
        }
        const books = await Book.find({});
        console.log(books);
        return books;
      } catch (error) {
        console.error(error.message);
        throw new GraphQLError("Error fetching books", {
          error,
        });
      }
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
    bookCount: async (root) => {
      console.log(root);
      const books = await Book.find({}).populate("author");
      const authorBooks = books.filter(
        (book) => book.author.name === root.name
      );
      return authorBooks.length;
    },
  },
  Book: {
    author: async (root) => {
      const populatedBook = await Book.findOne({ title: root.title }).populate(
        "author"
      );
      return populatedBook.author;
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("Authentication not found", {
          extensions: {},
        });
      }
      const author = await Author.findOne({ name: args.author });
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
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("Authentication not found", {
          extensions: {},
        });
      }
      const author = Author.find({ name: args.name });
      if (!author) return null;
      author.born = args.born;
      try {
        await author.save();
        return author;
      } catch (error) {
        throw new GraphQLError("Error saving author", {
          extensions: { error },
        });
      }
    },
    createUser: async (root, args) => {
      const user = new User({ ...args });
      try {
        await user.save();
      } catch (error) {
        throw new GraphQLError("Error creating user", {
          extensions: { error },
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== "library") {
        throw new GraphQLError("Incorrect credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      };

      const token = jwt.sign(userForToken, "secret");
      return { value: token };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), "secret");
      const currentUser = User.findById(decodedToken.id);
      return { currentUser };
    }
    return null;
  },
  introspection: true,
}).then(({ url }) => {
  console.log(url);
});
