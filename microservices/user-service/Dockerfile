# Dockerfile
FROM node:20-alpine
WORKDIR /app

ARG PORT
ARG JWT_SECRET 
ARG REFRESH_TOKEN_SECRET
ARG POSTGRES_URL


ENV PORT=$PORT
ENV JWT_SECRET=$JWT_SECRET
ENV REFRESH_TOKEN_SECRET=$REFRESH_TOKEN_SECRET
ENV POSTGRES_URL=$POSTGRES_URL


COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 6001
CMD ["npm", "start"]

# build the image
# docker build -t user-service:latest .

# run the container
# docker run -it \
#   -p 6001:6001 \
#   -e PORT=6001 \
#   -e JWT_SECRET=userandadmin \
#   -e REFRESH_TOKEN_SECRET=userandadminrefreshtoken \
#   -e "POSTGRES_URL=postgres://default:IEw75rBbpaUM@ep-dry-dream-a1ne0h83-pooler.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require" \
#   user-service:latest /bin/sh




# Add Env variables when docker build
# docker build \                                 
#   -t user-service:latest \
#   --build-arg PORT=6001 \
#   --build-arg JWT_SECRET=userandadmin \
#   --build-arg REFRESH_TOKEN_SECRET=userandadminrefreshtoken \
#   --build-arg POSTGRES_URL="postgres://default:IEw75rBbpaUM@ep-dry-dream-a1ne0h83-pooler.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require" \
#   .

# docker run -it -p 6001:6001 user-service:latest



# docker run -it \
#   -p 6001:6001 \
#   -e PORT=6001 \
#   -e JWT_SECRET=userandadmin \
#   -e REFRESH_TOKEN_SECRET=userandadminrefreshtoken \
#   -e "POSTGRES_URL=postgres://default:IEw75rBbpaUM@ep-dry-dream-a1ne0h83-pooler.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require" \
#   user-service:latest