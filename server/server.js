const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

db.on('error', (error) => {
  console.error('Error connecting to the database:', error);
});

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
    formatError: (err) => {
      console.error(err);
      return err;
    },
  });

  try {
    await server.start();
    server.applyMiddleware({ app });

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Serve up static assets
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/dist')));
    }

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
    });

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

startServer();