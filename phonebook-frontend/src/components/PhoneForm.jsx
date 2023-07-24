import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ALL_PERSONS, EDIT_NUMBER } from "../queries";

function PhoneForm({ setError }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [changeNumber, result] = useMutation(EDIT_NUMBER, {
    refetchQueries: [{ query: ALL_PERSONS }],
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    changeNumber({ variables: { name, phone } });

    setPhone("");
    setName("");
  };
  useEffect(() => {
    if (result.data && result.data.editNumber === null) {
      setError("person not found");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.data]);
  return (
    <div>
      <h2>Change Number</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            value={name}
            id="name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input
            value={phone}
            id="phone"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button type="submit">Change Number</button>
      </form>
    </div>
  );
}

export default PhoneForm;
