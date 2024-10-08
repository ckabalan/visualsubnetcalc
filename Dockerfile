FROM node:20-alpine as build

ARG REACT_APP_SERVICES_HOST=/services/m

COPY . /app
WORKDIR /app/src

RUN npm install
RUN npm run build


FROM nginx
COPY --from=build /app/dist /usr/share/nginx/html

