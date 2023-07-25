import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Book = ({ book }) => (
  <tr>
    <td>{book.title}</td>
    <td>{book.author}</td>
    <td>{book.published}</td>
  </tr>
);
const Books = () => {
  const result = useQuery(ALL_BOOKS);
  if (result.loading) {
    return <div>Loading...</div>;
  }
  const books = result.data.allBooks;
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
    </div>
  );
};

export default Books;
