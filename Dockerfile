# ------------------------- BUILD -------------------------------
FROM node:10 AS nerosketch/djing2-frontapp

ENV VUE_APP_BASE_API=/api
ENV DEFAULT_LANG=ru

USER node

ARG APP_DIR=/home/node/app

RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}
COPY . .

RUN npm install
RUN npx browserslist@latest --update-db
RUN npm run build --production

# ------------------------- DEVEL -----------------------------
FROM nerosketch/djing2-frontapp AS uidevel

ENV PORT=8080

EXPOSE ${PORT}

ENV NODE_ENV=development

CMD ["npm", "run", "serve"]
