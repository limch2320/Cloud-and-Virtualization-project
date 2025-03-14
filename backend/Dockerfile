# Python 3.9(또는 원하는 버전) 이미지 사용
FROM python:3.9

# 작업 디렉토리 설정
WORKDIR /app

# requirements.txt 복사 후 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 전체 복사
COPY . .

# Flask가 사용할 포트
EXPOSE 5000

# Flask 서버 실행
CMD ["python", "app.py"]
