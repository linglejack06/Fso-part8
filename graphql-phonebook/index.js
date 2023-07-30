/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Person = require("./models/person");
const User = require("./models/user");

mongoose.set("strictQuery", false);

require("dotenv").config();

const { MONGODB_URI } = process.env;
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to database");
  })
  .catch((error) => {
    console.error(`Error connecting to database: ${error.message}`);
  });
const typeDefs = `
  type User {
    username: String!
    friends: [Person!]!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Address {
    street: String!
    city: String! 
  }

  enum YesNo {
    YES
    NO
  }
  
  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
    me: User
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person

    editNumber(
      name: String!
      phone: String!
    ): Person
    createUser(
      username: String!
    ): User
    
    login(
      username: String!
      password: String!
    ): Token  
    
    addAsFriend(
      name: String!
    ): User
  }
`;

const resolvers = {
  Query: {
    personCount: async () => Person.collection.length,
    allPersons: async (root, args) => {
      if (!args.phone) {
        return Person.find({});
      }
      return Person.find({ phone: { $exists: args.phone === "YES" } });
    },
    findPerson: async (root, args) => Person.findOne({ name: args.name }),
    me: (root, args, context) => context.currentUser,
  },
  Person: {
    address: (root) => ({
      street: root.street,
      city: root.city,
    }),
  },
  Mutation: {
    addPerson: async (root, args, context) => {
      const person = new Person({ ...args });
      const { currentUser } = context;
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      try {
        await person.save();
        currentUser.friends = [...currentUser.friends, person];
        await currentUser.save();
      } catch (error) {
        console.error(error);
        throw new GraphQLError("Saving person failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }
      return person;
    },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name });
      if (!person) {
        return null;
      }
      person.phone = args.phone;
      try {
        await person.save();
      } catch (error) {
        throw new GraphQLError("Saving number failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }
      return person.save();
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username });
      try {
        await user.save();
      } catch (error) {
        throw new GraphQLError("Creating user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }
      return user;
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== "secret") {
        throw new GraphQLError("Incorrect credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const userForToken = {
        username: user.username,
        // eslint-disable-next-line no-underscore-dangle
        id: user._id,
      };
      return { value: jwt.sign(userForToken, "secret") };
    },
    addAsFriend: async (root, args, { currentUser }) => {
      const isFriend = (person) =>
        currentUser.friends
          .map((f) => f._id.toString())
          .includes(person._id.toString());

      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const person = await Person.findOne({ name: args.name });
      if (!isFriend(person)) {
        currentUser.friends = [...currentUser.friends, person];
      }
      await currentUser.save();
      return currentUser;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), "secret");
      const currentUser = await User.findById(decodedToken.id).populate(
        "friends"
      );
      return { currentUser };
    }
    return null;
  },
}).then(({ url }) => {
  console.log(`Server running at ${url}`);
});
