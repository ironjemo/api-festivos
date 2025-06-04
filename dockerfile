FROM node:latest

# crear carpeta de la aplicacion
WORKDIR /usr/src/app

#instalar las dependencias

COPY package*.json ./

#Descargar los modulos de Node JS

RUN npm install

# fuente de la aplicacion completo

COPY . .

EXPOSE 3030

CMD ["node", "app.js"]