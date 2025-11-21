
FROM node:18  


WORKDIR /app  


COPY ../App/package.json ../App/package-lock.json ./


RUN npm install  


COPY ../App .  


CMD ["npm", "start"]  


EXPOSE 3000