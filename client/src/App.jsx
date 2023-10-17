import React, { createContext, useState, useEffect } from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthService from './utils/auth';
import { useQuery } from '@apollo/client';
import { GET_ME } from './utils/queries';

export const UserContext = createContext();

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const { loading, error, data } = useQuery(GET_ME);

  useEffect(() => {
    const token = AuthService.getToken();
    if (token) {
      if (data) {
        setUserData(data.me);
        setAuthenticated(true);
      }
      if (error) {
        console.error("Failed to load user data:", error);
      }
    }
  }, [data, error]);

  if (loading) return <div>Loading...</div>;

  return (
    <UserContext.Provider value={{ authenticated, setAuthenticated, userData: data.me, setUserData }}>
      <Navbar />
      <Outlet />
    </UserContext.Provider>
  );
}

export default App;