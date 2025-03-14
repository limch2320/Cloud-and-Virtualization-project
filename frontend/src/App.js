import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./page/Home";
import Guestbook from "./page/Guestbook";
import Projects from "./page/Projects";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">홈</Link>
          <Link to="/guestbook">방명록</Link>
          <Link to="/projects">프로젝트</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guestbook" element={<Guestbook />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
