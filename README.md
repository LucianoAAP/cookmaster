# The project

This is a slightly modified version of a back-end project I had to develop during my studies at the "Trybe" web development course. It is a Node API with which you can make CRUD operations for meal recipes. This project was made using Express.js and MongoDB. It also has integration tests currently covering 90% of the lines of the files in the src folder.

# Features

- [x] user signup endpoint
- [x] user login endpoint
- [x] recipe creation endpoint
- [x] recipes listing endpoint
- [x] specific recipe visualization endpoint
- [x] query to insert an admin user (found in seed.js)
- [x] recipe editing endpoint
- [x] recipe deletion endpoint
- [x] recipe image addition endpoint
- [x] recipe image visualization endpoint
- [x] admin user signup endpoint
- [x] integration tests with 90% coverage in src

# Getting started

This project requires Node.js and MongoDB.

## Installation

1. First, clone the repository:
- `git clone git@github.com:LucianoAAP/cookmaster.git`
2. Then, enter the repository:
- `cd cookmaster`
3. Finally, install dependencies:
- `npm install`

## Starting the application

Just run `npm start`

## Testing the application

- To run the integration tests, use `npm test`
- To run the tests and see the testing coverage report, use `npm run test:coverage`