FROM node:18-slim
WORKDIR /app
COPY package.json .
RUN npm install
COPY server.js .
EXPOSE 5000
CMD ["npm", "start"]