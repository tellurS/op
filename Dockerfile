FROM alpine:latest
# Build the npm modules.
ADD package.json package.json 
RUN npm install

# Add the remaining source (excluding `root/app/node_modules` thanks to `.dockerignore`).
ADD dist /dist
VOLUME ["/data"]
CMD ["node json-server --watch ./data/dev.json --port 3001 && node http-server dist -p 80 --proxy 3001"]