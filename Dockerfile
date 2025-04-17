# 1단계: 빌드
FROM node:22 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# 2단계: Nginx 서버로 배포
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

