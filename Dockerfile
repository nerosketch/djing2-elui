# ------------------------- BUILD -------------------------------
FROM node:10 AS base

ENV VUE_APP_BASE_API=/api
ENV DEFAULT_LANG=ru

USER node

ARG APP_DIR=/home/node/app

RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

COPY package.json .
RUN npm install
RUN npx browserslist@latest --update-db

COPY . .

RUN npm run build --production

# ------------------------- DEVEL -----------------------------
FROM base AS uidevel

ENV PORT=8080

EXPOSE ${PORT}

ENV NODE_ENV=development

CMD ["npm", "run", "serve"]
