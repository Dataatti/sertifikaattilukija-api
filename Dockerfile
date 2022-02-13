# Credit to simplenerd (https://simplernerd.com/docker-typescript-production/)
FROM node:16.14-alpine as ts-compiler
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:16.14-alpine as ts-remover
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app/dist ./
RUN npm install --only=production
RUN ls -la
ENTRYPOINT ["node", "server.js"]
CMD ["-f","/dev/null"]