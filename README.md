# WebApp Contenerizada con Nodejs y MongoDB


## Crear Imagen para Docker

Creamos el fichero Dockerfile con el siguiente contenido:

```js
FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "index.js"]
```

Creamos la imagen con el comando:

```js
docker build -t jluisalvarez/node-webapp .
```


## MongoDB

```js
$ docker run -d --name mongo mongo
```

