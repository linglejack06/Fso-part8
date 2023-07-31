import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "../queries";

const Author = ({ author }) => (
  <tr>
    <td>{author.name}</td>
    <td>{author.born}</td>
    <td>{author.bookCount}</td>
  </tr>
);
const Authors = () => {
  const result = useQuery(ALL_AUTHORS);
  if (result.loading) {
    return <div>Loading...</div>;
  }
  console.log(result);
  const authors = result.data.allAuthors;
  return (
    <div>
      <h2>Authors</h2>
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Born in:</td>
            <td>Books Published</td>
          </tr>
        </thead>
        <tbody>
          {authors.map((a) => (
            <Author author={a} key={a.id} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Authors;
