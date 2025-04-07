# 클라우드및 가상화 개인프로젝트
React와 Flask를 이용한 프로젝트

cd backend
.\venv\Scripts\Activate.ps1   # 가상환경 활성화
pip install -r requirements.txt  # 패키지 설치
python app.py  # Flask 서버 실행

cd ../frontend
npm install  # 패키지 설치 (최초 실행 시)
npm start  # React 실행

docker-compose up --build
이후 localhost 접속