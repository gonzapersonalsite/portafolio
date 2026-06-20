# Stage 1: Base stage for dependency resolution
FROM node:24-alpine as base
WORKDIR /app

# Copy package files for dependency caching
COPY package.json pnpm-lock.yaml .npmrc pnpm-workspace.yaml ./

# Enable pnpm via corepack and install dependencies
RUN corepack enable && pnpm install --ignore-scripts && pnpm approve-builds esbuild && pnpm install

# ==========================================
# Stage 2: Development environment
# ==========================================
FROM base as development
ENV CI=true

# IMPORTANT: We need git installed to extract the commit hash during build
RUN apk add --no-cache git

# Copy the rest of the application code
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start Vite dev server
CMD ["pnpm", "run", "dev", "--", "--host"]

# ==========================================
# Stage 3: Build the React application
# ==========================================
FROM base as build

# Copy the rest of the application code
COPY . .

# IMPORTANT: We need git installed to extract the commit hash during build
RUN apk add --no-cache git

# Build argument for API URL
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the application
RUN pnpm run build

# ==========================================
# Stage 4: Serve the application with Nginx (Production)
# ==========================================
FROM nginx:alpine as production

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
