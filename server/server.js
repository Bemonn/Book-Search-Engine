const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

// Connect to the database
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// Handle database connection errors
db.on('error', (error) => {
  console.error('Error connecting to the database:', error);
});

async function startServer() {
  // Create new Apollo server and pass in schema data
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => authMiddleware({ req }),
    formatError: (err) => {
      console.error(err);
      return err;
    },
  });

  try {
    // Start the Apollo server
    await server.start();

    // Integrate Apollo server with the Express application
    server.applyMiddleware({ app });

    // Middleware for parsing body and JSON
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Serve up static assets if in production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/build')));
    }

    // If no API routes are hit, send the React app
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });

    // Once the database is open, start the server
    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`🌍 Now listening on localhost:${PORT}`);
        console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
      });
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

// Execute the server start function
startServer();