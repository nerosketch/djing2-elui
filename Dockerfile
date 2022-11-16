# ------------------------- BUILD -------------------------------
FROM node:10 AS uibuild

ENV VUE_APP_BASE_API=/api
ENV DEFAULT_LANG=ru

USER node

ARG APP_DIR=/home/node/app

RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}
COPY . .

RUN npm install
RUN npm run build --production

# ------------------------- RELEASE -----------------------------
FROM nginx:alpine AS frontprod
EXPOSE 80

ENV NGINX_PORT=80

RUN ["mkdir", "-p", "/var/www/media"]
RUN ["chown", "-R", "nginx.", "/var/www/media"]
RUN ["chmod", "777", "/var/www/media"]

COPY ["nginx/browsersupp.conf", "nginx/expires-hdrs.conf", "nginx/root_serve.conf", "nginx/nginx.conf", "/etc/nginx/"]
COPY ["nginx/bad_browser.html", "/var/www/"]

COPY --from=uibuild --chown=nginx:nginx ["/home/node/app/dist", "/var/www/app"]

COPY ["nginx/nginx_site.conf", "/etc/nginx/templates/default.conf.template"]

# ------------------------- NGINX DEVEL -----------------------------
FROM frontprod AS frontdev

COPY ["nginx/root_serve_dev.conf", "/etc/nginx/root_serve.conf"]

# ------------------------- DEVEL -----------------------------
FROM uibuild AS uidevel

ENV PORT=8080

EXPOSE ${PORT}

ENV NODE_ENV=development

CMD ["npm", "run", "serve"]

