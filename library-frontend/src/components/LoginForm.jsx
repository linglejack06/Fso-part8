import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries";
import { useState } from "react";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useMutation(LOGIN, {
    onError: (error) => {
      console.error(error.message);
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    login({ variables: { username, password } });
  };
};

export default LoginForm;
