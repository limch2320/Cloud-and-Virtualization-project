import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import Portfolio from "./page/Portfolio";
import Guestbook from "./page/Guestbook";
import Projects from "./page/Projects";
import Home from "./page/Home";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">홈</Link>
          <Link to="/guestbook">방명록</Link>
          <Link to="/portfolio">포트폴리오</Link>
          <Link to="/projects">프로젝트</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guestbook" element={<Guestbook />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
