const userTypeDef = `
extend type Query {
  me: User
}
type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}
`;
const userResolvers = {
  Query: {
    me: (root, args, { currentUser }) => {
      console.log(currentUser.favoriteGenre);
      return currentUser;
    },
  },
};

module.exports = { userResolvers, userTypeDef };
