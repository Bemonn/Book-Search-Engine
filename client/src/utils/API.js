const GRAPHQL_ENDPOINT = '/graphql';

const baseHeaders = {
  'Content-Type': 'application/json',
};

const authHeaders = (token) => ({
  ...baseHeaders,
  authorization: `Bearer ${token}`,
});

const graphqlRequest = (query, variables = {}, token) => {
  const headers = token ? authHeaders(token) : baseHeaders;

  return fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ query, variables }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });
};

export const getMe = (token) => {
  const query = `
    {
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
  return graphqlRequest(query, {}, token);
};

export const createUser = (userData) => {
  const mutation = `
    mutation addUser($username: String!, $email: String!, $password: String!) {
      addUser(username: $username, email: $email, password: $password) {
        token
        user {
          _id
          username
        }
      }
    }
  `;
  return graphqlRequest(mutation, userData);
};

export const loginUser = (userData) => {
  const mutation = `
    mutation login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          _id
          username
        }
      }
    }
  `;
  return graphqlRequest(mutation, userData);
};

export const saveBook = (bookData, token) => {
  const mutation = `
    mutation saveBook($authors: [String], $description: String, $title: String, $bookId: String, $image: String, $link: String) {
      saveBook(authors: $authors, description: $description, title: $title, bookId: $bookId, image: $image, link: $link) {
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
  return graphqlRequest(mutation, bookData, token);
};

export const deleteBook = (bookId, token) => {
  const mutation = `
    mutation removeBook($bookId: String!) {
      removeBook(bookId: $bookId) {
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
  return graphqlRequest(mutation, { bookId }, token);
};

export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};