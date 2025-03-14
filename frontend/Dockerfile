# 1) Node 환경에서 React 앱 빌드
FROM node:16-alpine AS build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
RUN npm run build

# 2) Nginx로 정적 파일 제공
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
