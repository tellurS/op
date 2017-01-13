FROM node:6.9.4-alpine

ADD package.json package.json 

ADD dist /dist
ADD src/server /src/server
ADD node_modules /node_modules

VOLUME ["/data"]
VOLUME ["/ssl"]
EXPOSE 5555

CMD [ "npm", "start" ]
