/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries";
import { useEffect, useState } from "react";

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, response] = useMutation(LOGIN, {
    onError: (error) => {
      console.error(error.message);
    },
  });
  useEffect(() => {
    if (response.data) {
      console.log("Working");
      setToken(response.data.login.value);
      localStorage.setItem("logged-user", response.data.login.value);
    }
  }, [response.data]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ variables: { username, password } });
    console.log(response);
    setUsername("");
    setPassword("");
  };
  const handleChange = (e) => {
    switch (e.target.name) {
      case "username":
        setUsername(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          value={username}
          onChange={handleChange}
          id="username"
          name="username"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={handleChange}
          id="password"
          name="password"
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
