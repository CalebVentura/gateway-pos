FROM public.ecr.aws/docker/library/node:18.18.2-alpine3.18
WORKDIR /app
COPY ./api .
# COPY tsconfig*.json ./
# COPY package*.json ./
RUN npm cache clean --force && npm install
# COPY . .
RUN npm run build
CMD ["node", "dist/main.js"]
# CMD ["npm", "run", "start:dev"]