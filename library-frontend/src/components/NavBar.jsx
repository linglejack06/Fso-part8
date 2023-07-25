import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav>
      <Link to="/">Authors</Link>
      <Link to="/books">Books</Link>
      <Link to="/add-book">Add Book</Link>
      <Link to="/edit-birth">Edit Birth of Author</Link>
    </nav>
  );
};

export default NavBar;
