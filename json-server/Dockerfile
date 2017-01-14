FROM node:6.9.4-alpine

#RUN npm install -g json-server
ADD ../node_modules node_modules

ADD ../package.json package.json 
#ADD src/server/package.json package.json 

#RUN npm prune --production
#RUN npm install

ADD dist /dist
ADD src/server /src/server

VOLUME ["/data"]
EXPOSE 80

CMD [ "json-server","./data/db.json", "--port 80"]
 