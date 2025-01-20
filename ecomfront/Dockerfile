# Stage 1: Build React App
FROM node:20-alpine AS build
WORKDIR /app

ARG NODE_ENV
ARG VITE_USER_SERVICE_URL
ARG VITE_CATEGORY_SERVICE_URL
ARG VITE_PRODUCT_SERVICE_URL
ARG VITE_CART_SERVICE_URL
ARG VITE_ORDER_SERVICE_URL

ENV NODE_ENV=$NODE_ENV
ENV VITE_USER_SERVICE_URL=$VITE_USER_SERVICE_URL
ENV VITE_CATEGORY_SERVICE_URL=$VITE_CATEGORY_SERVICE_URL
ENV VITE_PRODUCT_SERVICE_URL=$VITE_PRODUCT_SERVICE_URL
ENV VITE_CART_SERVICE_URL=$VITE_CART_SERVICE_URL
ENV VITE_ORDER_SERVICE_URL=$VITE_ORDER_SERVICE_URL


COPY package*.json ./
COPY postinstall.js ./
RUN npm install
# RUN npm run postinstall
COPY . .
RUN npm run build

# Stage 2: Serve the App
FROM nginx:alpine AS deployer
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]



# docker build \
#   -t ecomui:v1 \
#   --build-arg NODE_ENV=development \
#   --build-arg VITE_USER_SERVICE_URL="http://localhost:6001/user" \
#   --build-arg VITE_CATEGORY_SERVICE_URL="http://localhost:6002/category" \
#   --build-arg VITE_PRODUCT_SERVICE_URL="http://localhost:6003/product" \
#   --build-arg VITE_CART_SERVICE_URL="http://localhost:6004/cart" \
#   --build-arg VITE_ORDER_SERVICE_URL="http://localhost:8000/order" \
#   .

  # docker run -p 9091:80 ecomui:v1