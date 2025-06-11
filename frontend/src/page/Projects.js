import React, { useState } from "react";

function Projects() {
  const [activeTab, setActiveTab] = useState("projects");  const projects = [
    {
      title: "일몰시",
      description: "일단 몰입 시간의 줄임말로서 하루에 얼마나 몰입해서 공부했는지 알 수 있는 서비스입니다. 사용자의 학습 시간을 효과적으로 추적하고 분석하여 생산성 향상을 도모합니다.",
      period: "2024.03 - 2024.06",
      skills: ["MySQL", "Spring Boot", "Java", "REST API"],
      image: "/static/icon.png",
      type: "웹 서비스",
      hasLogo: true
    },    {
      title: "포트폴리오 웹사이트",
      description: "React와 Flask를 이용한 개인 포트폴리오 및 방명록 시스템입니다. SQLite 데이터베이스와 관리자 인증 시스템, 세션 관리 등의 보안 기능을 포함합니다.",
      period: "2025.04 - 2025.06",
      skills: ["React", "Flask", "SQLite", "Docker", "SQLAlchemy"],
      icon: "🌐",
      type: "웹 서비스",
      hasLogo: false
    },    {
      title: "연합학습 백도어 공격 실험",
      description: "Triggerless Clean-label 백도어 공격을 연합학습 환경에서 실험하고 분석한 연구 프로젝트입니다. BERT 모델과 SST-2 데이터셋을 활용하여 공격 효과를 검증했습니다.",
      period: "2025.04 - 2025.05",
      skills: ["Python", "PyTorch", "BERT", "Federated Learning", "NLP"],
      icon: "🔬",
      type: "연구 프로젝트",
      hasLogo: false
    }
  ];

  const papers = [
    {
      title: "연합학습 환경에서의 Triggerless Clean-label 백도어 공격 연구",
      titleEn: "Trigger-less Clean-label Backdoor Attack in Federated Learning",
      authors: "임창훈*, 김승한**, 최민영**, 김현일***",
      authorsEn: "Chang Hoon Lim*, Seunghan Kim**, Minyeong Choe**, Hyunil Kim***",
      affiliation: "조선대학교 (학부생, 석사과정, 조교수)",
      conference: "한국정보보호학회",
      period: "2025.02",
      abstract: "본 논문은 연합학습 환경에서의 Clean-label 백도어 공격을 수행한다. 연합학습 환경에서 클라이언트 간 비균일(non-i.i.d.) 데이터 분포는 트리거 없는 Clean-label 백도어 공격의 성공률을 크게 높이며(α=0.3에서 ASR≈99.996%), 이는 전통적 탐지 기법으로는 포착하기 어려운 은밀한 위협임을 보여준다.",
      keywords: ["연합학습", "백도어 공격", "인공지능 보안", "Clean-label", "비균일 데이터"],
      funding: "2025년 과학기술정보통신부 및 정보통신기획평가원의 SW중심대학사업지원 (2024-0-00062)",
      status: "게재 예정",
      type: "학술논문"
    }
  ];  return (
    <div className="container">
      <div className="projects-header">
        <h1>프로젝트 & 연구</h1>
        <p className="projects-subtitle">
          개발 프로젝트부터 학술 연구까지, 다양한 경험과 성과를 소개합니다.
        </p>
      </div>
      
      {/* 탭 네비게이션 */}
      <div className="tab-navigation">
        <button
          onClick={() => setActiveTab("projects")}
          className={`tab-button ${activeTab === "projects" ? "active" : ""}`}
        >
          개발 프로젝트
        </button>
        <button
          onClick={() => setActiveTab("papers")}
          className={`tab-button ${activeTab === "papers" ? "active" : ""}`}
        >
          연구 논문
        </button>
      </div>      {/* 프로젝트 탭 */}
      {activeTab === "projects" && (
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card" data-type={project.type}>
              <div className="project-image">
                {project.hasLogo ? (
                  <img src={project.image} alt={project.title} />
                ) : (
                  <div style={{
                    fontSize: '3rem',
                    color: 'white',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    {project.icon}
                  </div>
                )}
              </div>
              <div className="project-info">
                <div className="project-header">
                  <h2>{project.title}</h2>
                  <span className="project-type-badge">
                    {project.type}
                  </span>
                </div>
                <p className="project-period">{project.period}</p>
                <p className="project-description">{project.description}</p>
                <div className="project-skills">
                  {project.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 논문 탭 */}
      {activeTab === "papers" && (
        <div className="papers-grid">
          {papers.map((paper, index) => (
            <div key={index} className="paper-card" style={{
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '20px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}>
              
              {/* 헤더 */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ 
                    backgroundColor: '#d1ecf1', 
                    color: '#0c5460', 
                    padding: '4px 12px', 
                    borderRadius: '16px', 
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {paper.type}
                  </span>
                  <span style={{ 
                    backgroundColor: paper.status === "게재 예정" ? '#fff3cd' : '#d4edda', 
                    color: paper.status === "게재 예정" ? '#856404' : '#155724', 
                    padding: '4px 12px', 
                    borderRadius: '16px', 
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {paper.status}
                  </span>
                </div>
                <h2 style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  color: '#212529', 
                  marginBottom: '8px',
                  lineHeight: '1.4'
                }}>
                  {paper.title}
                </h2>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: 'normal', 
                  color: '#6c757d', 
                  marginBottom: '12px',
                  fontStyle: 'italic'
                }}>
                  {paper.titleEn}
                </h3>
              </div>

              {/* 저자 및 소속 */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '14px', color: '#495057', marginBottom: '4px' }}>
                  <strong>저자:</strong> {paper.authors}
                </p>
                <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '4px' }}>
                  <strong>소속:</strong> {paper.affiliation}
                </p>
                <p style={{ fontSize: '14px', color: '#495057', marginBottom: '0' }}>
                  <strong>발표:</strong> {paper.conference} ({paper.period})
                </p>
              </div>

              {/* 초록 */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#212529', marginBottom: '8px' }}>
                  연구 요약
                </h4>
                <p style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.6', 
                  color: '#495057',
                  textAlign: 'justify'
                }}>
                  {paper.abstract}
                </p>
              </div>

              {/* 키워드 */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#212529', marginBottom: '8px' }}>
                  주요 키워드
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {paper.keywords.map((keyword, keywordIndex) => (
                    <span key={keywordIndex} style={{
                      backgroundColor: '#f8f9fa',
                      color: '#495057',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      border: '1px solid #dee2e6'
                    }}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* 연구비 지원 */}
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '12px', 
                borderRadius: '6px',
                border: '1px solid #e9ecef'
              }}>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#6c757d', 
                  margin: '0',
                  lineHeight: '1.4'
                }}>
                  <strong>연구 지원:</strong> {paper.funding}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;
