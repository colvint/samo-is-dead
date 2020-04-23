FROM node:current-alpine
WORKDIR /app
COPY package.json .
COPY lerna.json .
COPY system ./system
COPY views/accounts ./views/accounts
RUN npx lerna bootstrap
CMD ["npm", "--prefix", "views/accounts", "start"]
