FROM node:18

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

EXPOSE 3000

# 환경변수 설정
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV WDS_SOCKET_HOST=localhost
ENV WDS_SOCKET_PORT=3000
ENV WDS_SOCKET_PATH=/ws

# 개발 모드로 실행
CMD ["npm", "start"]
