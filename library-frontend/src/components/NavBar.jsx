import { Link } from "react-router-dom";

const NavBar = ({ token }) => {
  return (
    <nav>
      <Link to="/">Authors</Link>
      <Link to="/books">Books</Link>
      {token ? (
        <div>
          <Link to="/add-book">Add Book</Link>
          <Link to="/edit-birth">Edit Birth of Author</Link>
          <Link to="/recommendations">Recommendations</Link>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default NavBar;
