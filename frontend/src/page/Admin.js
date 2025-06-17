import React, { useState, useEffect } from 'react';

function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [adminStatus, setAdminStatus] = useState({});
  const [stats, setStats] = useState({});
  const [allEntries, setAllEntries] = useState([]);
  const [showAllEntries, setShowAllEntries] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8080';

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/status`, {
        credentials: 'include'
      });
      const data = await response.json();
      setIsAdmin(data.is_admin);
      setAdminStatus(data);
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/guestbook/stats`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (!data.error) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  const fetchAllEntries = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/guestbook`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (!data.error) {
        setAllEntries(data.entries);
        setShowAllEntries(true);
      }
    } catch (error) {
      console.error('Error fetching all entries:', error);
    }
  };

  const deleteEntry = async (entryId) => {
    if (!window.confirm("정말로 이 메시지를 삭제하시겠습니까?")) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/guestbook/${entryId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        // 목록에서 삭제된 항목 제거
        setAllEntries(allEntries.filter(entry => entry.id !== entryId));
        // 통계 새로고침
        fetchStats();
        alert('메시지가 삭제되었습니다.');
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ key: adminKey })
      });

      const data = await response.json();
        if (response.ok) {
        setIsAdmin(true);
        setAdminKey('');
        checkAdminStatus(); // 상태 정보 업데이트
        alert('관리자 로그인 성공!');
      } else {
        alert(data.error || '로그인 실패');
      }
    } catch (error) {
      console.error('Error during admin login:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/admin/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setIsAdmin(false);
      alert('로그아웃되었습니다.');
    } catch (error) {
      console.error('Error during admin logout:', error);
    }
  };
  if (loading) {
    return (
      <div className="container admin-container">
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
          <p style={{ color: '#4a5568', fontSize: '1.1rem' }}>로딩 중...</p>
        </div>
      </div>
    );
  }return (
    <div className="container admin-container">
      <h1 style={{ textAlign: 'center', marginBottom: '3rem', color: '#2d3748' }}>사이트 관리</h1>
        {!isAdmin ? (
        <div className="admin-login-container">
          <div className="admin-login-card">
            <h2>접근 인증</h2>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="인증 키를 입력하세요"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="admin-login-input"
                required
              />
              <button type="submit" className="admin-login-btn">
                인증하기
              </button>
            </form>
            <p className="admin-login-description">
              관리자 권한이 필요한 페이지입니다.<br/>
              인증 후 사이트 관리 기능을 사용할 수 있습니다.
            </p>
          </div>
        </div>
      ) : (        <div className="admin-dashboard">
          <div className="admin-status-card">
            <h3>관리 권한 활성화됨</h3>
            <p>
              세션 만료: {adminStatus.expires_in_minutes > 0 ? `${adminStatus.expires_in_minutes}분 후` : '곧 만료됨'}
            </p>
          </div>
          
          {/* 통계 섹션 */}
          <div className="admin-stats-card">
            <h3>방명록 통계</h3>
            <div className="admin-stats-grid">
              <div className="admin-stat-item">
                <div className="admin-stat-number" style={{ color: '#007bff' }}>
                  {stats.total_entries || 0}
                </div>
                <div className="admin-stat-label">전체 메시지</div>
              </div>
              <div className="admin-stat-item">
                <div className="admin-stat-number" style={{ color: '#28a745' }}>
                  {stats.today_entries || 0}
                </div>
                <div className="admin-stat-label">오늘 메시지</div>
              </div>
              <div className="admin-stat-item">
                <div className="admin-stat-number" style={{ color: '#ffc107' }}>
                  {stats.week_entries || 0}
                </div>
                <div className="admin-stat-label">이번 주 메시지</div>
              </div>
            </div>
          </div>
          
          <div className="admin-actions">
            <button onClick={handleLogout} className="admin-btn secondary">
              로그아웃
            </button>
            <button onClick={fetchAllEntries} className="admin-btn">
              모든 메시지 관리
            </button>
          </div>          {/* 모든 메시지 목록 */}
          {showAllEntries && (
            <div>
              <h3>모든 방명록 메시지 ({allEntries.length}개)</h3>
              <button onClick={() => setShowAllEntries(false)} className="admin-hide-btn">
                목록 숨기기
              </button>
              
              <div className="admin-entries-list">
                {allEntries.map((entry) => (
                  <div key={entry.id} className="admin-entry-item">
                    <div className="admin-entry-header">
                      <div className="admin-entry-id">
                        #{entry.id} - {entry.name}
                      </div>
                      <button 
                        onClick={() => deleteEntry(entry.id)}
                        className="admin-delete-btn"
                      >
                        삭제
                      </button>
                    </div>
                    <div style={{ margin: '1rem 0', color: '#4a5568', lineHeight: '1.6' }}>
                      {entry.message}
                    </div>
                    <small style={{ color: '#718096', fontWeight: '500' }}>
                      {formatDate(entry.timestamp)}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          )}          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(15px)',
            padding: '2rem',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            marginTop: '2rem'
          }}>
            <h3 style={{ color: '#2d3748', marginBottom: '1.5rem' }}>사용 가능한 기능</h3>
            <ul style={{ 
              paddingLeft: '1.5rem',
              color: '#4a5568',
              lineHeight: '2',
              fontSize: '1rem'
            }}>
              <li>방명록 메시지 삭제</li>
              <li>방명록 통계 조회</li>
              <li>모든 메시지 일괄 관리</li>
              <li>세션 기반 보안 인증</li>
            </ul>
            <p style={{ marginTop: '1.5rem' }}>
              <a 
                href="/guestbook" 
                style={{ 
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                방명록으로 이동하여 관리하기 →
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
