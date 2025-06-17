import React, { useState, useEffect } from "react";
import { ReactComponent as GithubIcon } from '../icons/github.svg';

function Home() {
  const [portfolio, setPortfolio] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8080';

  useEffect(() => {
    fetch(`${API_URL}/portfolio`)
      .then(res => res.json())
      .then(data => setPortfolio(data))
      .catch(err => console.error("Error fetching portfolio:", err));
  }, []);

  if (!portfolio) return (
    <div className="container">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid rgba(102, 126, 234, 0.2)',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}></div>
        <p style={{ color: '#4a5568', fontSize: '1.1rem' }}>포트폴리오를 불러오는 중...</p>
      </div>
    </div>
  );

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
            <GithubIcon className="github-icon" /> GitHub
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