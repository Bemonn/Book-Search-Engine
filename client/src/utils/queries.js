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

// Placeholder for a query to search books. You need to replace it with your actual query structure
export const SEARCH_BOOKS = gql`
  query SearchBooks($searchTerm: String!) {
    // Assume there is a 'searchBooks' query defined in your GraphQL schema
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

// Placeholder for a mutation to save a book. You need to adjust it according to your GraphQL schema
export const SAVE_BOOK = gql`
  mutation SaveBook($bookData: BookInput!) {
    // Assume 'saveBook' is a mutation in your GraphQL schema
    saveBook(bookData: $bookData) {
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