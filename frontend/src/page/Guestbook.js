import React, { useState, useEffect } from "react";

function Guestbook() {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const fetchEntries = () => {
    fetch("http://127.0.0.1:5000/guestbook")
      .then(res => res.json())
      .then(data => setEntries(data.entries))
      .catch(err => console.error("Error fetching guestbook:", err));
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { name, message };
    fetch("http://127.0.0.1:5000/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry)
    })
      .then(res => res.json())
      .then(data => {
        console.log("Entry added:", data);
        setName("");
        setMessage("");
        fetchEntries(); // 새 데이터로 갱신
      })
      .catch(err => console.error("Error adding entry:", err));
  };

  return (
    <div className="container">
      <h1>방명록</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="이름" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="메시지" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          required 
        />
        <button type="submit">작성</button>
      </form>
      <h2>방명록 목록</h2>
      {entries.length === 0 ? (
        <p>등록된 메시지가 없습니다.</p>
      ) : (
        <ul style={{ listStyleType: "none" }}>
          {entries.map((entry, index) => (
            <li key={index}>
              <strong>{entry.name}</strong>: {entry.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Guestbook;
