import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav>
      <Link to="/">Authors</Link>
      <Link to="/books">Books</Link>
    </nav>
  );
};

export default NavBar;
