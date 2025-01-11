# Dockerfile
FROM node:20-alpine
WORKDIR /app

ARG PORT
ARG MONGO_URI
ARG CATEGORY_SERVICE_URL
ARG CATEGORY_GRPC_ADDRESS

ENV PORT=$PORT
ENV MONGO_URI=$MONGO_URI
ENV CATEGORY_SERVICE_URL=$CATEGORY_SERVICE_URL
ENV CATEGORY_GRPC_ADDRESS=$CATEGORY_GRPC_ADDRESS

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 6003
CMD ["npm", "start"]


# docker build -t seynath/product-service:latest .

# docker run -it \
#   --name product-service \
#   -p 6003:6003 \
#   -e PORT=6003 \
#   -e MONGO_URI="mongodb+srv://ecommerce:sH32wUZJLkiY6aGQ@cluster0.muua9it.mongodb.net/product?retryWrites=true&w=majority&appName=Cluster0" \
# -e CATEGORY_SERVICE_URL="http://localhost:6002/category" \
#   -e CATEGORY_GRPC_ADDRESS="category_service:50051" \
#   product-service:latest