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
        id
        name
        email
      }
    }
  `;
  return graphqlRequest(query, {}, token);
};

export const createUser = (userData) => {
  const mutation = `
    mutation CreateUser($data: UserType!) {
      createUser(data: $data) {
        id
        name
        token
      }
    }
  `;
  return graphqlRequest(mutation, { data: userData });
};

export const loginUser = (userData) => {
  const mutation = `
    mutation LoginUser($data: LoginInput!) {
      loginUser(data: $data) {
        token
        user {
          id
          name
        }
      }
    }
  `;
  return graphqlRequest(mutation, { data: userData });
};

export const saveBook = (bookData, token) => {
  const mutation = `
    mutation SaveBook($data: BookInput!) {
      saveBook(data: $data) {
        id
        title
      }
    }
  `;
  return graphqlRequest(mutation, { data: bookData }, token);
};

export const deleteBook = (bookId, token) => {
  const mutation = `
    mutation DeleteBook($bookId: ID!) {
      deleteBook(bookId: $bookId) {
        success
        message
      }
    }
  `;
  return graphqlRequest(mutation, { bookId }, token);
};


// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
