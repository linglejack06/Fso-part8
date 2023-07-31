import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Authors from "./components/Authors";
import Books from "./components/Books";
import BookForm from "./components/BookForm";
import BirthForm from "./components/BirthForm";
import LoginForm from "./components/LoginForm";
import { useEffect } from "react";
import { setToken, useTokenDispatch } from "./contexts/tokenContext";

const App = () => {
  const tokenDispatch = useTokenDispatch();
  useEffect(() => {
    const token = localStorage.getItem("logged-user");
    if (token) {
      tokenDispatch(setToken(token));
    }
  });
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add-book" element={<BookForm />} />
        <Route path="/edit-birth" element={<BirthForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </div>
  );
};

export default App;
