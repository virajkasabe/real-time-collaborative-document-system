## BACKEND COLLABORATION

### SEND_COLLABORATION - POST

```bash

   http://localhost:5000/api/v1/rtcds/collab/send-collab/:docId

```

- param data like

```json

        docId : "document_id"

```

- body data like

```json
{
  "email": "example@gmail.com",
  "role": "ROLE"
}
```

### ACCEPT_COLLABORATION - POST

```bash

   http://localhost:5000/api/v1/rtcds/collab/accept/email=example@gmail.com/join=joinToken

```

- param data like

```json
{
  "email": "example@gmail",
  "join": "joinToken"
}
```

- body data like

```json
{
  "email": "example@gmail.com",
  "role": "ROLE"
}
```

### DECLINE_COLLABORATION - POST

```bash

   http://localhost:5000/api/v1/rtcds/collab/accept/email=example@gmail.com/join=joinToken

```

- param data like

```json
{
  "email": "example@gmail",
  "join": "joinToken"
}
```
