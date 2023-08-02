const { GraphQLError } = require("graphql");
const Book = require("../models/book");

const bookTypeDef = `
extend type Query {
  allBooks(author: String, genre: String): [Book!]!
  bookCount: Int!
}
type Book {
  title: String!
  author: Author!
  published: Int!
  id: ID!
  genres: [String!]!
}
`;

const bookResolvers = {
  Book: {
    author: async (root) => {
      const populatedBook = await Book.findOne({ title: root.title }).populate(
        "author"
      );
      return populatedBook.author;
    },
  },
  Query: {
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
    bookCount: () => (Book.collection.length ? Book.collection.length : 0),
  },
};

module.exports = { bookResolvers, bookTypeDef };
