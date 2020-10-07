const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema/schema');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

mongoose.connect(
  'mongodb+srv://void:123123123mlab@cluster0.bzwui.mongodb.net/graphql-tutor?retryWrites=true&w=majority',
  { useNewUrlParser: true }
);

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

const dbConnection = mongoose.connection;
dbConnection.on('error', (err) => console.error(`Connection error: ${err}`));
dbConnection.once('open', () => console.log('Connected to DB!'));

app.listen(PORT, (err) => {
  err ? console.log(`Error:${err}`) : console.log(`Server started at ${PORT}!`);
});
