# Use official Node.js image as the base
FROM node:18-alpine AS build
# Default to container-to-container URL; can be overridden with --build-arg
ARG REACT_APP_API_URL=http://backend:4000
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build


FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
