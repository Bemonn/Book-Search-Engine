import { gql } from '@apollo/client';

// Existing query to get logged-in user information
export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

export const SEARCH_BOOKS = gql`
  query SearchBooks($searchTerm: String!) {
    searchBooks(searchTerm: $searchTerm) {
      bookId
      authors
      description
      title
      image
      link
    }
  }
`;

// Define the SAVE_BOOK mutation
export const SAVE_BOOK = gql`
  mutation saveBook($input: BookInput!) {
    saveBook(input: $input) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;