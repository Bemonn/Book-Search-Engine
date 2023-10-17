import React, { createContext, useState, useEffect } from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthService from './utils/auth';
import { useQuery } from '@apollo/client';
import { GET_ME } from './utils/queries';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Set up the http link to connect Apollo Client to the GraphQL server
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Set up the authentication link for Apollo Client to attach the JWT token to every request
const authLink = setContext((_, { headers }) => {
  const token = AuthService.getToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Create a new Apollo Client instance with the required configurations
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Create a context for user data
export const UserContext = createContext();

function App() {
  const [userData, setUserData] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const { loading, error, data } = useQuery(GET_ME);

  // Handle user data and authentication status
  useEffect(() => {
    const token = AuthService.getToken();
    if (token) {
      setAuthenticated(true);
      if (error) {
        console.error("Error loading user data:", error);
      }
      if (data) {
        setUserData(data.me);
      }
    } else {
      setAuthenticated(false);
    }
  }, [data, error]);

  // Conditional rendering based on data loading status
  if (loading) return <div>Loading...</div>;

  return (
    <ApolloProvider client={client}>
      <UserContext.Provider value={{ userData, setUserData, authenticated, setAuthenticated }}>
        <Navbar />
        <Outlet />
      </UserContext.Provider>
    </ApolloProvider>
  );
}

export default App;