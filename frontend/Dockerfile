FROM node:18

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

EXPOSE 80

# 개발 모드로 실행
CMD ["npm", "start"]
