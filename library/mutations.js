/* eslint-disable no-underscore-dangle */
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Author = require("./models/author");
const Book = require("./models/book");

const mutations = {
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
            bookCount: 0,
          });
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
      console.log(token);
      return { value: token };
    },
  },
};

module.exports = mutations;
