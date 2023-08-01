/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Person = require("./models/person");
const User = require("./models/user");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

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
