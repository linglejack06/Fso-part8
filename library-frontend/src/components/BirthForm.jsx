import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import Select from "react-select";
import { ALL_AUTHORS, EDIT_BIRTH } from "../queries";
import { useNavigate } from "react-router-dom";

const BirthForm = () => {
  const result = useQuery(ALL_AUTHORS);
  const navigate = useNavigate();
  const [editBirth, finishedResult] = useMutation(EDIT_BIRTH, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [born, setBorn] = useState(1900);
  if (result.loading) {
    return <div>Loading...</div>;
  }
  console.log(result.data.allAuthors);
  const handleSubmit = (e) => {
    e.preventDefault();
    editBirth({ variables: { name: selectedAuthor.value, born } });
    console.log(finishedResult);
    navigate("/");
  };
  const options = result.data.allAuthors.map((author) => ({
    value: author.name,
    label: author.name,
  }));

  return (
    <form onSubmit={handleSubmit}>
      <Select
        defaultValue={selectedAuthor}
        onChange={setSelectedAuthor}
        options={options}
      />
      <div>
        <label htmlFor="born">Birth Year</label>
        <input
          type="number"
          value={born}
          onChange={(e) => setBorn(e.target.value)}
          id="born"
        />
      </div>
      <button type="submit">Change birth year</button>
    </form>
  );
};

export default BirthForm;
