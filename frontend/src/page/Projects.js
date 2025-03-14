import React from "react";

function Projects() {
  const projects = [
    {
      title: "일몰시",
      description: "일단 몰입 시간의 줄임말로서 하루에 얼마나 몰입해서 공부했는지 알 수 있는 서비스 입니다.",
      period: "2024.03 - 2024.06",
      skills: ["MYsql", " ,Spring"],
      image: "/static/icon.png"
    },
  ];

  return (
    <div className="container">
      <h1>프로젝트</h1>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <div className="project-image">
              <img src={project.image} alt={project.title} />
            </div>
            <div className="project-info">
              <h2>{project.title}</h2>
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
    </div>
  );
}

export default Projects;
