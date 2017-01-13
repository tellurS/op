FROM node:6.9.4-alpine


ADD node_modules /node_modules

ADD package.json package.json 
#ADD src/server/package.json package.json 

#RUN npm prune --production
#RUN npm install

ADD dist /dist
ADD src/server /src/server

VOLUME ["/data"]
VOLUME ["/ssl"]
EXPOSE 5555

CMD [ "npm", "start" ]
