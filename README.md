# CommerceIQ: SDE-Intern: Home Assignment

## Problem Statement:

- Build a REST based JSON mock server to easily add, update, delete and access data from a JSON file.

  - Every data set should have a parent identifier (entity type), which will be used in the GET APIs.
  - Every data set should have an `ID` (Primary key)
  - ID should be immutable, error needs to be thrown if ID is tried to be mutated.
  - If you make `POST`, `PUT`, `PATCH` or `DELETE` requests, changes have to be automatically saved to store.json.
  - The `store.json` file should support multiple entity types.

    ![Schema_Look](https://lh6.googleusercontent.com/SBhwRnq6DtyHPWDDjVxGAmcuQpMaI58Y2it3z1mqNgkLOn4BIqG5KCG7WK26Y2_AvZ6kZCXlweWMTw3brJU0vUb7vnqYk6Atnc5sj6gZxZwTpQV58F6dfVg6j-oj_-ms-RM9EvlZ)

- Sample APIs to be supported by the mock server on store.json file:

  - `GET /posts`
  - `GET /posts/0`
  - `POST /posts`
  - `PUT /authors/1`
  - `PATCH /posts/1`
  - `DELETE /posts/1`

- Enable filtering at entity level :

  - `GET /posts?title=title1&author=CIQ`

- Enable sorting at entity level :

  - `GET /posts?_sort=views&_order=asc`

- Enable basic search at entity level:

  - `GET /posts?q=IQ`

- Support for `nested structures` will yield a `bonus point`.

- Treat store.json as an `empty slate` where you can add and retrieve any data.

---

## Solution:

- Language Used - JavaScript (NodeJS)

Implemented all the below **features** according to `problem statement` and code hosted on GitHub along with CI-CD pipeline (`GitHub Actions`) and `APIs` hosted on `AWS EC2 instance` for user consumption.

### Features:-

- [x] Every data set should have a parent identifier (entity type), which will be used in the GET APIs.
- [x] Every data set should have an ID (Primary key)
- [x] ID should be immutable, error needs to be thrown if ID is tried to be mutated.
- [x] If you make POST, PUT, PATCH or DELETE requests, changes have to be automatically saved to store.json.
- [x] The store.json file should support multiple entity types.
- [x] Sample APIs to be supported by the mock server on store.json file:
  ```md
  GET /posts
  GET /posts/0
  POST /posts
  PUT /authors/1
  PATCH /posts/1
  DELETE /posts/1
  ```
- [x] Enable filtering at entity level :

  - `GET /posts?title=title1&author=CIQ`

- [x] Enable sorting at entity level :

  - `GET /posts?_sort=views&_order=asc`

- [x] Enable basic search at entity level:

  - `GET /posts?q=IQ`

- [x] Support for `nested structures` will yield a `bonus point`.
- [x] Treat store.json as an empty slate where you can add and retrieve any data.

### API Documentation:-

- **APIs base url**: `http://13.126.6.160:3000/`
- **Postman Collection** to Explore all APIs - https://github.com/rajvijen/jsonapi/blob/master/postman_collection.json
  - [This `Postman-Collection` can be imported in Postman]
- **Postman API Documentation**: https://documenter.getpostman.com/view/8005036/TVt2c4BR
  - From here APIs can be opened by clicking on right corner button - `Run in Postman` as follows
    [![Image from Gyazo](https://i.gyazo.com/8bc7838bfa5c1b6e9dea0da25f0b774d.png)](https://gyazo.com/8bc7838bfa5c1b6e9dea0da25f0b774d)

### Data Store:-

- Data stored in `store.json`.
  - Initially creates automatically on server starts, if doesn't exists.
- Sample data store (`store.json`)
  - File Link - https://github.com/rajvijen/jsonapi/blob/master/store.json
  - Tree View of JSON file data - https://jsonformatter.org/20f3df
    - JSON Graph
      [![Image from Gyazo](https://i.gyazo.com/6b49451874d6acff66c089bd622e01fe.png)](https://gyazo.com/6b49451874d6acff66c089bd622e01fe)

### Code Repository:-

- **Code Repo** - https://github.com/rajvijen/jsonapi
- _Files and Directories Structure_

```md
├── config
│   └── config.js
├── dbutils
│   ├── controllers.js
│   ├── routes.js
│   └── service.js
├── package.json
├── package-lock.json
├── postman_collection.json
├── README.md
├── server.js
└── store.json
```

- Entry point file - `server.js`
- packages dependencies -

```json
{
  "dependencies": {
    "async-mutex": "^0.2.6",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "express-validator": "^6.9.0",
    "morgan": "^1.10.0",
    "underscore": "^1.12.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.6"
  }
}
```

### Special Features Implemented:-

- Infinite Nesting (Level of Threading can be go upto any level, something like `reddit discussion threads`)
- Used `Mutex locks` for simultaneous writes
