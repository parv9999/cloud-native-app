# Build Stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage (Serve with Nginx)
FROM nginx:alpine
# Copy the build output from the previous stage to Nginx's default public folder
COPY --from=build /app/build /usr/share/nginx/html
# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
