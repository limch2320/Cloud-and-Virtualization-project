import React, { useState, useEffect } from "react";

function Guestbook() {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8080';

  const fetchEntries = (page = 1) => {
    fetch(`${API_URL}/guestbook?page=${page}&per_page=5`)
      .then(res => res.json())
      .then(data => {
        setEntries(data.entries || []);
        setPagination(data.pagination || {});
      })
      .catch(err => {
        console.error("Error fetching guestbook:", err);
        setEntries([]);
        setPagination({});
      });
  };
  const checkAdminStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/status`, {
        credentials: 'include'
      });
      const data = await response.json();
      setIsAdmin(data.is_admin);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    fetchEntries(currentPage);
    checkAdminStatus();
  }, [currentPage]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      alert("이름과 메시지를 모두 입력해주세요.");
      return;
    }
      const newEntry = { name: name.trim(), message: message.trim() };
    fetch(`${API_URL}/guestbook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(`오류: ${data.error}`);
        } else {
          console.log("Entry added:", data);
          setName("");
          setMessage("");
          setCurrentPage(1); // 첫 페이지로 이동
          fetchEntries(1); // 새 데이터로 갱신
        }
      })
      .catch(err => console.error("Error adding entry:", err));
  };
  const handleDelete = (entryId) => {
    if (!isAdmin) {
      alert("관리자만 삭제할 수 있습니다.");
      return;
    }
    
    if (!window.confirm("정말로 이 메시지를 삭제하시겠습니까?")) {
      return;
    }
      fetch(`${API_URL}/guestbook/${entryId}`, {
      method: "DELETE",
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(`오류: ${data.error}`);
        } else {
          fetchEntries(currentPage); // 현재 페이지 새로고침
        }
      })
      .catch(err => console.error("Error deleting entry:", err));
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR');
  };  return (
    <div className="container">
      <h1>방명록</h1>
        {/* 관리자 상태 표시 */}
      <div className={`admin-status ${isAdmin ? 'active' : 'inactive'}`}>
        {isAdmin ? (
          "관리자로 로그인됨 - 메시지 삭제 가능"
        ) : (
          <a href="/admin">관리자</a>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="guestbook-form">
        <input 
          type="text" 
          placeholder="이름을 입력해주세요" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="메시지를 남겨주세요" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          required 
        />
        <button type="submit">작성하기</button>
      </form>      <h2>방명록 목록</h2>
      {(!entries || entries.length === 0) ? (
        <div className="guestbook-container">
          <p style={{ textAlign: 'center', color: '#6c757d', fontSize: '1.1rem' }}>
            등록된 메시지가 없습니다. 첫 번째 메시지를 남겨보세요! 
          </p>
        </div>
      ) : (
        <>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: "2rem",
            padding: '1rem',
            background: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '15px',
            color: '#4a5568',
            fontWeight: '600'
          }}>
            총 {pagination.total || 0}개의 메시지 (페이지 {pagination.page || 1}/{pagination.pages || 1})
          </div>
          <div>
            {entries.map((entry) => (
              <div key={entry.id} className="guestbook-entry">
                <div className="guestbook-entry-header">
                  <div className="guestbook-entry-name">{entry.name}</div>
                  {isAdmin && (
                    <button 
                      onClick={() => handleDelete(entry.id)}
                      className="guestbook-delete-btn"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <div className="guestbook-entry-message">{entry.message}</div>
                <div className="guestbook-entry-date">
                  {formatDate(entry.timestamp)}
                </div>
              </div>
            ))}
          </div>
          
          {/* 페이징 버튼 */}
          <div className="pagination-container">
            <button 
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.has_prev}
              className="pagination-btn"
            >
              이전
            </button>            <div className="pagination-info">
              {pagination.page || 1} / {pagination.pages || 1}
            </div>
            <button 
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.has_next}
              className="pagination-btn"
            >
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Guestbook;
