# syntax=docker/dockerfile:1

# https://v2.ja.vuejs.org/v2/cookbook/dockerize-vuejs-app
FROM node:lts-buster-slim AS dev

ARG LANG C.UTF-8
ARG TZ Asia/Tokyo

# To create a working directory in the docker container
WORKDIR /app

# To copy files to the working directory
COPY package.json package-lock.json /app/

RUN --mount=type=cache,target=/root/.npm npm install && \
    npm ci
COPY . .

CMD [ "npm", "run", "dev" ]


FROM node:lts-buster-slim AS build

WORKDIR /app

COPY --from=dev /app /app

RUN npm run build


FROM nginx:latest AS prod

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx","-g","daemon off;"]
