const express = require('express');
const path = require('path');
const db = require('./config/connection');

const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

async function startServer() {
  // Create new Apollo server and pass in schema data
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => authMiddleware({ req }),
  });

  // Start the server
  await server.start();

  // Integrate Apollo server with Express application
  server.applyMiddleware({ app });

  // Middleware for parsing body and JSON
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Serve up static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  // If no API routes are hit then send the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  // Connect to MongoDB database and start the Express.js server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

// Execute the server start function
startServer().catch((err) => {
  console.error(err);
  process.exit(1);
});