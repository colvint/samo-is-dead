FROM node:current-alpine
# RUN apk add postgresql-client
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY *.js ./
RUN npm i
CMD ["npm", "start"]
