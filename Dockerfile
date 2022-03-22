# ------------------------- BUILD -------------------------------
FROM node:10 AS uibuild

ENV VUE_APP_BASE_API=/api

USER node

ARG APP_DIR=/home/node/app

RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}
COPY . .

RUN npm install
RUN npm run build --production

# ------------------------- RELEASE -----------------------------
FROM nginx:alpine AS uiprod
EXPOSE 80

ENV NGINX_SERVER_NAME=localhost

RUN mkdir -p /var/www

COPY ["browsersupp.conf", "expires-hdrs.conf", "/etc/nginx/"]
COPY ["bad_browser.html", "/var/www/"]

COPY --from=0 --chown=nginx:nginx ["/home/node/app/dist", "/var/www/app"]
RUN mkdir -p /var/www/app/media

COPY ["nginx_site.conf", "/etc/nginx/conf.d/default.conf"]

# ------------------------- DEVEL -----------------------------
FROM uibuild AS uidevel

ENV PORT=80

EXPOSE ${PORT}

ENV NODE_ENV=development

WORKDIR ${APP_DIR}

CMD ["npm", "run", "serve"]

