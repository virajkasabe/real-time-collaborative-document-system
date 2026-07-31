# build stage 

FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# production stage

FROM node:22-alpine 

WORKDIR /app
ENV PATH="/user/local/bin:$PATH"
RUN npm i -g serve

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["npx", "server", "-s", "dist", "-l", "5000"]


