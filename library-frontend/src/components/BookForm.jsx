import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ADD_NEW_BOOK, ALL_AUTHORS, ALL_BOOKS } from "../queries";
import { useNavigate } from "react-router-dom";

const BookForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState(1999);
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [addNewBook, result] = useMutation(ADD_NEW_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    addNewBook({ variables: { title, author, published, genres } });
    console.log(result.data);
    navigate("/books");
  };
  const handleChange = (e) => {
    switch (e.target.name) {
      case "title":
        setTitle(e.target.value);
        break;
      case "author":
        setAuthor(e.target.value);
        break;
      case "published":
        setPublished(e.target.value);
        break;
      case "genre":
        setGenre(e.target.value);
        break;
    }
  };
  const handleGenreAdd = () => {
    setGenres([...genres, genre]);
    setGenre("");
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input value={title} onChange={handleChange} name="title" id="title" />
      </div>
      <div>
        <label htmlFor="author">Author</label>
        <input
          value={author}
          onChange={handleChange}
          name="author"
          id="author"
        />
      </div>
      <div>
        <label htmlFor="published">Publication Year</label>
        <input
          type="number"
          value={published}
          onChange={handleChange}
          name="published"
          id="published"
        />
      </div>
      <div>
        <input value={genre} onChange={handleChange} name="genre" />
        <button type="button" onClick={handleGenreAdd}>
          Add genre
        </button>
        <div>
          <p>Genres: {genres.join(", ")}</p>
        </div>
      </div>
      <button type="submit">Add Book</button>
    </form>
  );
};

export default BookForm;
