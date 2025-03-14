# 1) Node 환경에서 React 앱 빌드
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 80

CMD ["npm", "start"]
