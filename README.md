# 클라우드 및 가상화 개인프로젝트
React와 Flask를 이용한 포트폴리오 및 방명록 웹사이트

## 🚀 주요 기능

### 포트폴리오
- 개인 정보 및 프로젝트 소개
- 관심사 및 경력 정보

### 방명록 시스템
- SQLite 데이터베이스를 이용한 영구 데이터 저장
- 페이징 지원 (페이지당 5개 항목)
- 실시간 타임스탬프 표시
- 입력 데이터 검증 (이름 100자, 메시지 1000자 제한)

### 관리자 시스템
- 세션 기반 관리자 인증 (2시간 만료)
- 로그인 실패 시도 제한 (5회 실패 시 15분 잠금)
- 방명록 메시지 삭제 권한
- 실시간 통계 대시보드
- 모든 메시지 일괄 관리 기능

## 🛠️ 기술 스택

### Backend
- **Flask** - Python 웹 프레임워크
- **Flask-SQLAlchemy** - ORM 및 데이터베이스 관리
- **Flask-CORS** - CORS 지원
- **SQLite** - 경량 데이터베이스

### Frontend
- **React** - 사용자 인터페이스
- **React Router** - 클라이언트 사이드 라우팅

## 📦 설치 및 실행

### 로컬 환경에서 실행

#### 백엔드 실행
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python app.py
```

#### 프론트엔드 실행
```bash
cd frontend
npm install
npm start
```

### Docker를 이용한 실행
```bash
docker-compose up --build
```

## 🔐 보안 설정

### 환경변수 설정 (권장)
```bash
# 관리자 키 설정 (기본값: admin123)
export ADMIN_KEY=your-secure-admin-key

# 세션 비밀키 설정
export SECRET_KEY=your-secret-session-key
```

### 기본 관리자 키
- **개발환경**: `admin123`
- **운영환경**: 반드시 환경변수로 설정할 것

## 📊 API 엔드포인트

### 포트폴리오
- `GET /portfolio` - 포트폴리오 데이터 조회

### 방명록
- `GET /guestbook` - 방명록 목록 조회 (페이징 지원)
- `POST /guestbook` - 새 메시지 추가
- `DELETE /guestbook/<id>` - 메시지 삭제 (관리자 전용)

### 관리자
- `POST /admin/login` - 관리자 로그인
- `POST /admin/logout` - 관리자 로그아웃
- `GET /admin/status` - 관리자 상태 확인
- `GET /admin/guestbook` - 모든 메시지 조회 (관리자 전용)
- `GET /admin/guestbook/stats` - 방명록 통계 (관리자 전용)

## 🌐 접속 정보
- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8080
- **관리자 페이지**: http://localhost:3000/admin

## 📁 프로젝트 구조
```
Cloud-and-Virtualization-project/
├── backend/
│   ├── app.py                 # Flask 메인 애플리케이션
│   ├── requirements.txt       # Python 패키지 목록
│   ├── Dockerfile            # 백엔드 Docker 설정
│   └── instance/
│       └── guestbook.db      # SQLite 데이터베이스
├── frontend/
│   ├── src/
│   │   ├── page/
│   │   │   ├── Home.js       # 홈 페이지
│   │   │   ├── Guestbook.js  # 방명록 페이지
│   │   │   ├── Admin.js      # 관리자 페이지
│   │   │   └── Projects.js   # 프로젝트 페이지
│   │   └── App.js            # 메인 App 컴포넌트
│   ├── package.json          # Node.js 패키지 목록
│   └── Dockerfile           # 프론트엔드 Docker 설정
├── docker-compose.yml        # Docker Compose 설정
└── README.md                # 프로젝트 문서
```

## ⚙️ 개발 정보
- **작성자**: 임창훈
- **학과**: 조선대학교 정보보호학과
- **연구분야**: 인공지능 보안, 분산 ID
- **프로젝트 기간**: 2025년 4월 ~ 6월