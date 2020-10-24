const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const Movies = require('../models/movie');
const Directors = require('../models/director');

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: GraphQLString },
    director: {
      type: DirectorType,
      resolve(parent) {
        return Directors.findById(parent.directorId);
      }
    }
  })
});

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent) {
        return Movies.find({ directorId: parent.id });
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: { type:  new GraphQLNonNull(GraphQLString) },
        age: { type:  new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, { name, age }) {
        const directors = new Directors({ name, age });
        return directors.save();
      }
    },
    deleteDirector: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Directors.findOneAndRemove(args.id);
      }
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
        name: { type:  new GraphQLNonNull(GraphQLString) },
        age: { type:  new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, { id, name, age }) {
        return Directors.findByIdAndUpdate(id, { $set: { name, age } }, { new: true });
      }
    },

    addMovie: {
      type: MovieType,
      args: {
        name: { type:  new GraphQLNonNull(GraphQLString) },
        genre: { type:  new GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID }
      },
      resolve(parent, { name, genre, directorId }) {
        const movies = new Movies({ name, genre, directorId });
        return movies.save();
      }
    },
    deleteMovie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Movies.findOneAndRemove(args.id);
      }
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        name: { type:  new GraphQLNonNull(GraphQLString) },
        genre: { type:  new GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID }
      },
      resolve(parent, { id, name, genre, directorId }) {
        return Movies.findByIdAndUpdate(id, { $set: { name, genre, directorId } }, { new: true });
      }
    }
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return Movies.findById(id);
      }
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return Directors.findById(id);
      }
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve() {
        return Movies.find({});
      }
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve() {
        return Directors.find({});
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
