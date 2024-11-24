# Stage 1: Build React App
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
COPY postinstall.js ./
RUN npm install
# RUN npm run postinstall
COPY . .
RUN npm run build

# Stage 2: Serve the App
FROM nginx:alpine as deployer
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
