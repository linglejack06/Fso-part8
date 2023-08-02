/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const cors = require("cors");
const http = require("http");
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
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

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
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
    })
  );
  const PORT = 4000;

  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}`);
  });
};

start();
