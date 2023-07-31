/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer } from "react";

export const tokenContext = createContext();

const tokenReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "REMOVE":
      return null;
    default:
      return state;
  }
};

export const setToken = (token) => ({
  type: "SET",
  payload: token,
});
export const removeToken = () => ({
  type: "REMOVE",
});

export const useTokenValue = () => {
  const [token, tokenDispatch] = useContext(tokenContext);
  return token;
};
export const useTokenDispatch = () => {
  const [token, tokenDispatch] = useContext(tokenContext);
  return tokenDispatch;
};

export const TokenContextProvider = ({ children }) => {
  const [token, tokenDispatch] = useReducer(tokenReducer, null);
  return (
    <tokenContext.Provider value={[token, tokenDispatch]}>
      {children}
    </tokenContext.Provider>
  );
};
