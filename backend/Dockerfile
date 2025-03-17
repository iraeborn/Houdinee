FROM  node:18.0.0-alpine
 
# set working directory
 
RUN mkdir -p /usr/src/app
 
WORKDIR /usr/src/app
 
COPY . /usr/src/app/
 
RUN npm install --force
 
# build app
RUN npm run build
 
EXPOSE 3100
# start app
 
CMD ["npm","run","start:prod"]