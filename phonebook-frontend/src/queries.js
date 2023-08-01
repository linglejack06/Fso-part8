import { gql } from "@apollo/client";

const PERSON_DETAILS = gql`
  fragment personDetails on Person {
    name
    phone
    id
    address {
      street
      city
    }
  }
`;
export const ALL_PERSONS = gql`
  query {
    allPersons {
      ...personDetails
    }
  }
  $[PERSON_DETAILS]
`;
export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      ...personDetails
    }
  }
  ${PERSON_DETAILS}
`;
export const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $street: String!
    $city: String!
    $phone: String
  ) {
    addPerson(name: $name, street: $street, city: $city, phone: $phone) {
      ...personDetails
    }
  }
  ${PERSON_DETAILS}
`;

export const EDIT_NUMBER = gql`
  mutation editNumber($name: String!, $phone: String!) {
    editNumber(name: $name, phone: $phone) {
      ...personDetails
    }
  }
  ${PERSON_DETAILS}
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;
