import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Authors from "./components/Authors";
import Books from "./components/Books";
import BookForm from "./components/BookForm";
import BirthForm from "./components/BirthForm";
import LoginForm from "./components/LoginForm";
import RecommendedBooks from "./components/RecommendedBooks";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { CURRENT_USER } from "./queries";

const App = () => {
  const [token, setToken] = useState(null);
  const result = useQuery(CURRENT_USER);
  if (result.loading) return "Loading";
  const user = result.data.me;
  return (
    <div>
      <NavBar token={token} />
      <Routes>
        <Route path="/" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add-book" element={<BookForm />} />
        <Route path="/edit-birth" element={<BirthForm />} />
        <Route path="/login" element={<LoginForm setToken={setToken} />} />
        <Route
          path="/recommendations"
          element={<RecommendedBooks user={user} />}
        />
      </Routes>
    </div>
  );
};

export default App;
