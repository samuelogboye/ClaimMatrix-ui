# ---- Stage 1: Build the app ----
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app


ARG VITE_API_URL 
ARG VITE_ENVIRONMENT 
ARG VITE_TOKEN_EXPIRY_BUFFER
ARG VITE_UPLOAD_MAX_SIZE
ARG VITE_APP_NAME
ARG VITE_APP_VERSION


# Expose them to Vite build
ENV VITE_API_URL = https://claimmatrix.samuelogboye.com/api/v1
ENV VITE_ENVIRONMENT = production 
ENV VITE_TOKEN_EXPIRY_BUFFER=${VITE_TOKEN_EXPIRY_BUFFER}
ENV VITE_UPLOAD_MAX_SIZE=${VITE_UPLOAD_MAX_SIZE}
ENV VITE_APP_NAME=${VITE_APP_NAME}
ENV VITE_APP_VERSION=${VITE_APP_VERSION}


# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy the source code
COPY . .

# Build the Vite app for production
RUN npm run build

# ---- Stage 2: Run the app using vite preview ----
FROM node:20-alpine

WORKDIR /app

# Copy build output and dependencies needed to run preview
COPY --from=builder /app ./

# Expose Vite's default preview port
EXPOSE 5173

# Run Vite's production preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173", "--open", "false"]
