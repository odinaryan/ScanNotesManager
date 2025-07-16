FROM node:20-alpine AS base
WORKDIR /app
EXPOSE 5173

FROM base AS development
# Copy package files from the correct location
COPY modules/frontend/package.json ./
COPY modules/frontend/package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code from the correct location
COPY modules/frontend .

# Start development server with hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM base AS build
# Copy package files from the correct location
COPY modules/frontend/package.json ./
COPY modules/frontend/package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code from the correct location
COPY modules/frontend .

# Build the application
RUN npm run build

FROM nginx:alpine AS production
# Copy built app to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx/frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 