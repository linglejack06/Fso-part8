/* eslint-disable import/no-extraneous-dependencies */
const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

const subscriptionTypeDefs = `
type Subscription {
  bookAdded : Book!
}
`;

const subscriptionResolvers = {
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = { subscriptionResolvers, subscriptionTypeDefs, pubsub };
