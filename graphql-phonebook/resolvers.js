/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const { GraphQLError } = require("graphql");
const { PubSub } = require("graphql-subscriptions");
const jwt = require("jsonwebtoken");
const Person = require("./models/person");
const User = require("./models/user");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    personCount: async () => Person.collection.length,
    allPersons: async (root, args) => {
      if (!args.phone) {
        return Person.find({}).populate("friendOf");
      }
      return Person.find({ phone: { $exists: args.phone === "YES" } }).populate(
        "friendOf"
      );
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

      pubsub.publish("PERSON_ADDED", { personAdded: person });
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
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterator("PERSON_ADDED"),
    },
  },
};

module.exports = resolvers;
