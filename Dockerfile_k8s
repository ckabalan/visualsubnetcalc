FROM node:20-alpine AS build

ARG REACT_APP_SERVICES_HOST=/services/m

# Set working directory and copy only package files for better cache utilization
WORKDIR /app/src
COPY src/package*.json /app/src/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . /app

# Build the application
RUN npm run build


# Use a specific version of nginx
# https://hub.docker.com/r/nginxinc/nginx-unprivileged
FROM nginxinc/nginx-unprivileged:stable-alpine
USER root
RUN adduser -D --uid 2000 nonroot
RUN apk update && apk upgrade --available && sync

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Set a non-root user
USER 2000
