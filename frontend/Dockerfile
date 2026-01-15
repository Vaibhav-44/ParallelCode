FROM node:18-alpine AS build
WORKDIR /app

# Allow passing backend URL at build time. Default points to compose service name.
ARG REACT_APP_BACKEND_URL=http://backend:5000
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}

# Install dependencies (use npm ci for reproducible installs)
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . ./
RUN npm run build

FROM nginx:stable-alpine

# Copy built static files
COPY --from=build /app/build /usr/share/nginx/html

# Healthcheck for container orchestrators
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
