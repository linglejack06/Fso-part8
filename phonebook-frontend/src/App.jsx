import { useQuery } from "@apollo/client";
import { useState } from "react";
import { ALL_PERSONS } from "./queries";
import Persons from "./components/persons";
import PersonForm from "./components/PersonForm";
import PhoneForm from "./components/PhoneForm";
import Message from "./components/Notification";

function App() {
  const result = useQuery(ALL_PERSONS);
  const [errorMessage, setErrorMessage] = useState(null);

  if (result.loading) {
    return <div>Loading...</div>;
  }
  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };
  return (
    <div>
      <Message errorMessage={errorMessage} />
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </div>
  );
}

export default App;
