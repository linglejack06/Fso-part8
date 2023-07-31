import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Authors from "./components/Authors";
import Books from "./components/Books";
import BookForm from "./components/BookForm";
import BirthForm from "./components/BirthForm";
import LoginForm from "./components/LoginForm";
import { useState } from "react";

const App = () => {
  const [token, setToken] = useState(null);
  return (
    <div>
      <NavBar token={token} />
      <Routes>
        <Route path="/" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add-book" element={<BookForm />} />
        <Route path="/edit-birth" element={<BirthForm />} />
        <Route path="/login" element={<LoginForm setToken={setToken} />} />
      </Routes>
    </div>
  );
};

export default App;
