FROM node:current-alpine
WORKDIR /app
COPY lerna.json .
COPY package.json .
COPY system ./system
COPY services ./services
RUN npx lerna bootstrap
CMD ["npm", "--prefix", "services/accounts", "start"]
