# real-time-collaborative-document-system
A secure real-time collaborative document editor inspired by Google Docs and Microsoft Word using React, Node.js, Socket.IO, MongoDB, and Redis.

## REDIS


###### ===============================================

 NOTE : FIRSTLY RUN THE SERVER OF REDIS USING DOCKER

###### ===============================================

#

- when you don't have a redis on docker

#### STEP : 1

``` docker

docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest

```

###### ===============================================

 NOTE : YOU CAN SEE THE REDIS LOCALLY USING GIVEN COMMAND

###### ===============================================

```

http://localhost:8001

```
- using this url you can see your changes also

### ----- xxxxx -----


#### STEP : 2
- for test which container was runining

``` docker

docker ps

```

#### STEP : 3
- for our normal terminal ( own machine terminal so what will we do )


``` docker

docker exec -it [CONTAINER_ID] bash

```

#### STEP : 4
- for our normal terminal ( own machine terminal so what will we do )

``` docker

redis-cli

```

- now you'r in redis terminal


- you wan't to check the redis server was up an runing or not then
- write like "ping" on terminal

``` redis

ping

```

- when you'll get output like

```

PONG

```

- then your redis server is up an runing successfully
