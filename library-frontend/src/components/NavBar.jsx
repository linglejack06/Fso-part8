import { Link } from "react-router-dom";
import { useTokenValue } from "../contexts/tokenContext";

const NavBar = () => {
  const token = useTokenValue();
  return (
    <nav>
      <Link to="/">Authors</Link>
      <Link to="/books">Books</Link>
      {token ? (
        <div>
          <Link to="/add-book">Add Book</Link>
          <Link to="/edit-birth">Edit Birth of Author</Link>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default NavBar;
