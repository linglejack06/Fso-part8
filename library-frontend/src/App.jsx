import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Authors from "./components/Authors";
import Books from "./components/Books";
import BookForm from "./components/BookForm";

const App = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add-book" element={<BookForm />} />
      </Routes>
    </div>
  );
};

export default App;
