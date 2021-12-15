FROM node:10

EXPOSE 8080

#ENV VUE_APP_BASE_API=http://localhost:8000/api
#ENV NODE_ENV=development

USER node

ARG APP_DIR=/home/node/app
ARG NODE_ENV=${NODE_ENV}

RUN chown -R node. ${APP_DIR}

WORKDIR ${APP_DIR}

COPY . .

CMD npm install && exec npm run serve
