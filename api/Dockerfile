# FROM node:18
FROM node:18-alpine3.16
WORKDIR /app
RUN ls -la
RUN pwd
COPY ./api .
RUN ls -la
RUN pwd
# COPY tsconfig*.json ./
# COPY package*.json ./
# RUN ls -la
RUN npm cache clean --force && npm install
# COPY . .
RUN npm run build
CMD ["node", "dist/main.js"]
# CMD ["npm", "run", "start:dev"]