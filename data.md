```json

{
  _id: ObjectId('6a35009b9a0f9ee57abf1128'),
  title: 'Untitle Document',
  ownerId: ObjectId('6a31e3623a696b8bb644b5b4'),
  version: NumberInt('7'),
  isPublic: false,
  isTrash: false,
  users: [
    {
      userId: ObjectId('6a31e4be3a696b8bb644b5b5'),
      role: 'Editor',
      _id: ObjectId('6a3500d89a0f9ee57abf1129')
    },
    {
      userId: ObjectId('6a348de0b7b1c571fa65a932'),
      role: 'Owner',
      _id: ObjectId('6a3500f49a0f9ee57abf1134')
    }
  ],
  createdAt: ISODate('2026-06-19T08:40:59.260Z'),
  updatedAt: ISODate('2026-06-19T13:59:12.366Z'),
  __v: NumberInt('0'),
  content: {
    ops: [
      {
        position: NumberInt('0'),
        text: 'h',
        attributes: {
          italic : true,
          bold : true,
          color : #dst26
        }
      }
    ]
  }
}



```




```
Google Console config barobar aahe. Issue ha ahe ki aplla frontend axios.get() ne OAuth callback call karto — pan te browser ne page redirect karun karaycha asto, axios ne nahi. Fix: button click zalyavar window.location.href ne redirect karaycha, axios call kadhun takaycha

```