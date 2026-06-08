## BACKEND DOCUMENT

### CREATE_DOCUMENT - POST

```bash

   http://localhost:5000/api/v1/rtcds/doc/create-doc

```

- data like

```json
{
  "title": "document_name"
}

```

### FETCH_FOLDER_WHERE_YOUR  - GET

```bash

   http://localhost:5000/api/v1/rtcds/doc/fetch-folder

```


### FETCH_PARTICULAR_DOCUMENT - GET

```bash

   http://localhost:5000/api/v1/rtcds/doc/fetch-doc/:docId

```
- param data like

```json
{
  "docId": "document._id"
}

```
