FROM node:8.0.0-alpine

RUN addgroup -S nodejs && adduser -S -g nodejs nodejs
RUN apk add --no-cache bash sed git openssh

RUN cd /tmp && git clone -b integration https://github.com/PathwayCommons/pathways-search.git
RUN cd /tmp/pathways-search && npm install
RUN npm install -g webpack http-server

RUN mkdir -p /webapps/pathway_search
WORKDIR /webapps/pathway_search

RUN cp -r /tmp/pathways-search/. /webapps/pathway_search/

# replace www host to beta in development
RUN sed -i 's/www\.pathwaycommons\.org/beta\.pathwaycommons\.org/g' /webapps/pathway_search/node_modules/pathway-commons/dist/private/constants.js
RUN npm run build

RUN chown -R nodejs:nodejs /webapps/pathway_search

EXPOSE 8080
USER nodejs

CMD ["http-server", "./public", "-p", "8080"]
