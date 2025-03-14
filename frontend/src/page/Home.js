import React, { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";

function Home() {
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/portfolio")
      .then(res => res.json())
      .then(data => setPortfolio(data))
      .catch(err => console.error("Error fetching portfolio:", err));
  }, []);

  if (!portfolio) return <div>Loading portfolio...</div>;

  return (
    <div className="container">
      <div className="portfolio-header">
        {portfolio.image && (
          <div className="portfolio-image">
            <img src={portfolio.image} alt="내 사진" />
          </div>
        )}
        <div className="portfolio-intro">
          <h1>{portfolio.name}</h1>
          <a 
            href="https://github.com/limch2320" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            <FaGithub /> GitHub
          </a>
          <p>{portfolio.bio}</p>
        </div>
      </div>

      <div className="portfolio-content">
        <div className="left-section">
          <h2>HISTORY</h2>
          <ul>
            {portfolio.projects.map((project, index) => (
              <li key={index} className="project-item">
                <strong>{project.title}</strong>
                <p>{project.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="right-section">
          <h2>관심 분야</h2>
          {portfolio.interests && portfolio.interests.length > 0 ? (
            <ul>
              {portfolio.interests.map((interest, index) => (
                <li key={index}>{interest}</li>
              ))}
            </ul>
          ) : (
            <p>관심 분야 정보가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;