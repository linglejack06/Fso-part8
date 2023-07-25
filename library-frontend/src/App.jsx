import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Authors from "./components/Authors";

const App = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Authors />} />
        {/* <Route path="/books" element={<Books />} /> */}
      </Routes>
    </div>
  );
};

export default App;
