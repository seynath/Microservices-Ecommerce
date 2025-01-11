# Dockerfile
FROM node:20-alpine
WORKDIR /app

ARG PORT
ARG MONGO_URI
ARG CATEGORY_GRPC_ADDRESS_PORT

ENV PORT=$PORT
ENV MONGO_URI=$MONGO_URI
ENV CATEGORY_GRPC_ADDRESS_PORT=$CATEGORY_GRPC_ADDRESS_PORT

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 6002 50051
CMD ["npm", "start"]



# docker build -t seynath/category-service:latest .

# docker run -it \
#   --name category-service \
#   -p 6002:6002 \
#   -p 50051:50051 \
#   -e PORT=6002 \
#   -e MONGO_URI="mongodb+srv://ecommerce:sH32wUZJLkiY6aGQ@cluster0.muua9it.mongodb.net/category?retryWrites=true&w=majority&appName=Cluster0" \
#   -e CATEGORY_GRPC_ADDRESS_PORT=50051 \
#   category-service:latest
