const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema/schema.js');
const mongoose = require('mongoose');

const user = 'void';
const pass = '123123123mlab';
const clusterName = 'cluster0.bzwui.mongodb.net';
const dbName = 'graphql-tutorial';

const connectionString = `mongodb+srv://${user}:${pass}@${clusterName}/${dbName}?retryWrites=true&w=majority`;

const app = express();
const PORT = 3000;

mongoose.connect(connectionString, { useNewUrlParser: true,  useUnifiedTopology: true  });

const dbConnection = mongoose.connection;
dbConnection.on('error', (err) => console.error(`[Error] ${err}`));
dbConnection.once('open', () => console.log('[Log] Connected to DB success!'));

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(PORT, (err) => {
  err ? console.log(`Error: ${err}`) : console.log(`Server started at ${PORT}!`);
});
