import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Contact from "../pages/Contact";

function App() {
  return (
    <>
      <h1>home page</h1>
      <nav>
        <Link to="/contact">Contact</Link>
      </nav>
      <Routes>
        <Route path="/contact" element={<Contact />} />
      </Routes>
    
    </>
  );
}

export default App;
