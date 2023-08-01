import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ALL_BOOKS_FILTERED_GENRE } from "../queries";
import { useState } from "react";
import Book from "./Book";

const Books = () => {
  const [genreSelection, setGenreSelection] = useState(null);
  const result = useQuery(
    genreSelection ? ALL_BOOKS_FILTERED_GENRE : ALL_BOOKS,
    {
      variables: genreSelection ? { genre: genreSelection } : {},
    }
  );
  const handleClick = (e) => {
    setGenreSelection(e.target.name);
  };
  const handleAllClick = () => {
    setGenreSelection(null);
  };
  if (result.loading) {
    return <div>Loading...</div>;
  }
  const books = result.data.allBooks;
  // flattens nested array of genres
  const differentGenres = [].concat(...books.map((book) => book.genres));
  // removes duplicates
  const filteredGenres = [...new Set(differentGenres)];
  return (
    <div>
      <h2>Books</h2>
      <table>
        <thead>
          <tr>
            <td>Title</td>
            <td>Author</td>
            <td>Year Of Publication</td>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <Book book={b} key={b.id} />
          ))}
        </tbody>
      </table>
      <ul>
        {filteredGenres.map((genre) => (
          <button name={genre} onClick={handleClick} key={genre}>
            {genre}
          </button>
        ))}
        <button onClick={handleAllClick}>Remove Filter</button>
      </ul>
    </div>
  );
};

export default Books;
