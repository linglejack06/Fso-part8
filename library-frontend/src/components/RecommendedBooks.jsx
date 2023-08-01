import { useQuery } from "@apollo/client";
import { ALL_BOOKS_FILTERED_GENRE } from "../queries";
import Book from "./Book";

const RecommendedBooks = ({ user }) => {
  const result = useQuery(ALL_BOOKS_FILTERED_GENRE, {
    variables: { genre: user.favoriteGenre },
  });
  if (result.loading) return "loading...";
  if (result.data.allBooks.length === 0) {
    return <div>No Books found with your favorite genre {":("}</div>;
  }
  const books = result.data.allBooks;
  return (
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
  );
};
export default RecommendedBooks;
