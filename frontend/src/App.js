import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Portfolio from "./page/Portfolio";
import Guestbook from "./page/Guestbook";
import Projects from "./page/Projects";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">포트폴리오</Link> |{" "}
          <Link to="/guestbook">방명록</Link> |{" "}
          <Link to="/projects">프로젝트</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/guestbook" element={<Guestbook />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
