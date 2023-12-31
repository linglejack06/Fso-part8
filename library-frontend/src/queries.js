import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      bookCount
      id
    }
  }
`;
export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      id
      genres
      author {
        name
      }
    }
  }
`;

export const ALL_BOOKS_FILTERED_GENRE = gql`
  query filteredGenreBooks($genre: String!) {
    allBooks(genre: $genre) {
      title
      published
      id
      genres
      author {
        name
      }
    }
  }
`;

export const ADD_NEW_BOOK = gql`
  mutation addNewBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
      }
      id
      published
    }
  }
`;

export const EDIT_BIRTH = gql`
  mutation editBirth($name: String!, $born: Int!) {
    editAuthor(name: $name, born: $born) {
      name
      born
      bookCount
    }
  }
`;

export const LOGIN = gql`
  mutation loginUser($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const CURRENT_USER = gql`
  query {
    me {
      favoriteGenre
      username
    }
  }
`;

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      author {
        name
      }
      id
      published
      genres
    }
  }
`;
