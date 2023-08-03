/* eslint-disable no-underscore-dangle */
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Author = require("./models/author");
const Book = require("./models/book");
const { pubsub } = require("./subscriptions");

const mutationTypeDef = `
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
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
const mutationResolver = {
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("Authentication not found", {
          extensions: {},
        });
      }
      try {
        const author = await Author.findOne({ name: args.author });
        let book;
        if (!author) {
          const newAuthor = new Author({
            name: args.author,
            born: null,
            bookCount: 1,
          });
          await newAuthor.save();
          book = new Book({
            title: args.title,
            published: args.published,
            genres: args.genres,
            author: newAuthor._id,
          });
        } else {
          author.bookCount += 1;
          book = new Book({
            title: args.title,
            published: args.published,
            genres: args.genres,
            author: author._id,
          });
          await author.save();
        }
        await book.save();
        pubsub.publish("BOOK_ADDED", { bookAdded: book });
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
        return user;
      } catch (error) {
        console.error(error);
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

module.exports = { mutationResolver, mutationTypeDef };
