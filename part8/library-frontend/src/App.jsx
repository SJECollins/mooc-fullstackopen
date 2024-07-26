import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import AddYear from "./components/AddYear";
import LoginPage from "./components/LoginPage";
import Recommend from "./components/Recommend";
import {
  useQuery,
  useMutation,
  useApolloClient,
  useSubscription,
} from "@apollo/client";
import {
  ALL_AUTHORS,
  ALL_BOOKS,
  ADD_BOOK,
  ADD_BIRTH_YEAR,
  BOOK_ADDED,
} from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    const storedToken = localStorage.getItem("library-user-token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData);
      alert(`New book added: ${subscriptionData.data.bookAdded.title}`);
    },
  });

  const authorResults = useQuery(ALL_AUTHORS);

  const bookResults = useQuery(ALL_BOOKS);

  // Books and authors do appear to update when the mutation is called
  // Does the exercise what me to approach this differently?
  const [createBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
  });
  const [addBirthYear] = useMutation(ADD_BIRTH_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (
    (page === "authors" && authorResults.loading) ||
    (page === "books" && bookResults.loading)
  ) {
    return <div>loading...</div>;
  }

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage("authors");
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>

        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("addYear")}>add year</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      {page === "authors" && (
        <Authors
          show={page === "authors"}
          authors={authorResults.data.allAuthors}
        />
      )}

      {page === "books" && (
        <Books show={page === "books"} books={bookResults.data.allBooks} />
      )}

      {page === "add" && (
        <NewBook
          show={page === "add"}
          createBook={createBook}
          setPage={setPage}
        />
      )}

      {page === "addYear" && (
        <AddYear
          show={page === "addYear"}
          authors={authorResults.data.allAuthors}
          addBirthYear={addBirthYear}
          setPage={setPage}
        />
      )}

      {page === "login" && <LoginPage setToken={setToken} setPage={setPage} />}

      {page === "recommend" && <Recommend show={page === "recommend"} />}
    </div>
  );
};

export default App;
