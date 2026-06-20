# Stage 1: Build the React application
FROM node:24-alpine as build

WORKDIR /app

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml .npmrc pnpm-workspace.yaml ./

# Enable pnpm via corepack and install dependencies
RUN corepack enable && pnpm install --ignore-scripts && pnpm approve-builds esbuild && pnpm install

# Copy the rest of the application code
COPY . .

# IMPORTANT: We need git installed to extract the commit hash during build
RUN apk add --no-cache git

# Build argument for API URL
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the application
RUN pnpm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Default backend URL (matching Render production URL)
ENV VITE_API_BASE_URL=https://portafolio-9uob.onrender.com/api

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
