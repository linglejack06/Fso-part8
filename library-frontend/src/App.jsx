import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Authors from "./components/Authors";
import Books from "./components/Books";
import BookForm from "./components/BookForm";
import BirthForm from "./components/BirthForm";
import LoginForm from "./components/LoginForm";
import RecommendedBooks from "./components/RecommendedBooks";
import { useState } from "react";
import { useQuery, useSubscription, useApolloClient } from "@apollo/client";
import { ALL_BOOKS, BOOK_ADDED, CURRENT_USER } from "./queries";

const App = () => {
  const [token, setToken] = useState(null);
  const result = useQuery(CURRENT_USER);
  const client = useApolloClient();
  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(data);
      window.alert(`Added book ${data.data.bookAdded.title}`);
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(data.data.bookAdded),
        };
      });
    },
  });
  if (result.loading) return "Loading";
  console.log(result);
  return (
    <div>
      <NavBar token={token} />
      <Routes>
        <Route path="/" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add-book" element={<BookForm />} />
        <Route path="/edit-birth" element={<BirthForm />} />
        <Route path="/login" element={<LoginForm setToken={setToken} />} />
        {token ? (
          <Route
            path="/recommendations"
            element={<RecommendedBooks user={result.data.me} />}
          />
        ) : null}
      </Routes>
    </div>
  );
};

export default App;
