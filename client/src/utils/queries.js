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
    // This assumes 'searchBooks' is defined in your server's schema
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