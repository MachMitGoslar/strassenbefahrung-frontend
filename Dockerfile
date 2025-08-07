# Build Stage
FROM node:20 AS build

# Arbeitsverzeichnis im Container
WORKDIR /app

# Abhängigkeiten installieren
COPY package*.json ./
RUN npm install

# Projektdateien kopieren und bauen
COPY . .
RUN npm run build

# ----------------------------------------

# Production Stage (mit nginx)
FROM nginx:stable-alpine

# Replace default nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf


# React Build in nginx-Webverzeichnis kopieren
COPY --from=build /app/build /usr/share/nginx/html

# Port freigeben
EXPOSE 80

# Containerstart
CMD ["nginx", "-g", "daemon off;"]
