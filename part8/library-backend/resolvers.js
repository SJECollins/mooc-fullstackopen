const { GraphQLError } = require("graphql");
const DataLoader = require("dataloader");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

const jwt = require("jsonwebtoken");
const book = require("./models/book");

const bookLoader = new DataLoader(async (authorIds) => {
  const books = await Book.find({ author: { $in: authorIds } });
  const booksByAuthor = authorIds.map((id) =>
    books.filter((book) => book.author.toString() === id.toString())
  );
  return booksByAuthor;
});

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {};
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) {
          filter.author = author._id;
        } else {
          return [];
        }
      }
      if (args.genre) {
        filter.genres = { $in: args.genre };
      }
      return Book.find(filter).populate("author");
    },

    allAuthors: async () => {
      const authors = await Author.find({});
      const authorIds = authors.map((author) => author._id);
      const books = await bookLoader.loadMany(authorIds);
      authors.forEach((author, index) => {
        author.bookCount = books[index].length;
      });
      return authors;
    },
    me: (roots, args, context) => {
      return context.currentUser;
    },
  },
  Author: {
    bookCount: async (root) => {
      const books = await bookLoader.load(root._id);
      return books.length;
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated");
      }

      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError("Saving author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          });
        }
      }
      const book = new Book({ ...args, author: author._id });
      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }
      const populatedBook = await Book.findById(book._id).populate("author");
      pubsub.publish("BOOK_ADDED", { bookAdded: populatedBook });
      return populatedBook;
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated");
      }

      const author = await Author.findOne({ name: args.name });

      if (!author) {
        throw new GraphQLError("Author not found", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }
      author.born = args.setBorn;
      try {
        const updatedAuthor = await author.save();

        const bookCount = await Book.countDocuments({
          author: updatedAuthor.id,
        });

        return { ...updatedAuthor.toObject({ virtuals: true }), bookCount };
      } catch (error) {
        throw new GraphQLError("Updating author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favouriteGenre: args.favouriteGenre,
      });
      try {
        await user.save();
      } catch (error) {
        throw new GraphQLError("Creating user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }
      return user;
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("Wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.SECRET) };
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
    },
  },
};

module.exports = resolvers;
