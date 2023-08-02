/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const cors = require("cors");
const { useServer } = require("graphql-ws/lib/use/ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { merge } = require("lodash");
const express = require("express");
const { createServer } = require("http");
const { WebSocketServer } = require("ws");
const User = require("./models/user");
const { authorTypeDef, authorResolvers } = require("./schemas/authorSchema");
const { userTypeDef, userResolvers } = require("./schemas/userSchema");
const tokenTypeDef = require("./schemas/tokenSchema");
const { bookTypeDef, bookResolvers } = require("./schemas/bookSchema");
const { mutationResolver, mutationTypeDef } = require("./mutations");
const {
  subscriptionResolvers,
  subscriptionTypeDefs,
} = require("./subscriptions");
require("dotenv").config();

const { MONGODB_URI } = process.env;
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to database"))
  .catch((error) => console.error(error));

const start = async () => {
  const app = express();
  const Query = `
  type Query {
    _empty: String
  }`;
  const httpServer = createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });
  const schema = makeExecutableSchema({
    typeDefs: [
      Query,
      authorTypeDef,
      bookTypeDef,
      tokenTypeDef,
      userTypeDef,
      mutationTypeDef,
      subscriptionTypeDefs,
    ],
    resolvers: merge(
      authorResolvers,
      bookResolvers,
      userResolvers,
      mutationResolver,
      subscriptionResolvers
    ),
  });
  const serverCleanup = useServer({ schema }, wsServer);
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
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
          console.log(auth, auth.substring(7));
          const decodedToken = jwt.verify(auth.substring(7), "secret");
          const currentUser = await User.findById(decodedToken.id);
          return { currentUser };
        }
        return null;
      },
    })
  );
  const PORT = 4000;

  httpServer.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};
start();
