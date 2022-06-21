# Everything-NodeJS

This is basically my Pratical example or implementation on how to build a node JS applications

## Getting Started

- [Node-First-App]:

  - ExpressJS
  - Dynamic Content and Templating Engine
  - Model, Views and Controllers
  - Dynamic Routes and Advanced Models

- [MySQL]:

  - Setup
  - connection
  - CRUD

- [Sequelize]:

  - defining Model
  - CRUD
  - Relationship

- [NoSQL-and-MongoDB]:

  - Setup
  - connection
  - CRUD

- [Mongoose]:

  - defining Model
  - CRUD
  - Relationship

- [Session-&-Cookies]:

  - Setup
  - configuration
  - session middleware
  - mongoDB Session
  - deleting cookie

- [Authentication]:

  - Setup
  - encrypting password
  - using middleware to protect routes
  - adding csrf protection
  - flashing success or error messages

- [Sending-Emails]: - npm install --save nodemailer nodemailer-sendgrid-transport

  - setup using nodemailer and sendgrid

- [Advanced-Authentication]:

  - password reset
  - token creation
  - password update logic

- [Validation]: npm install --save express-validator
  - set up
  - validation error messages
  - custom validators
  - async validations
  - keeping user inputs
  - sanitizing data

- [Error-Handling]:
  - set up
  - returning error pages
  - express error handling middlewares
  - status codes

- [File-Upload-and-Download]:
  - setting up multer
  - handling file uploads with multer
  - filter files by mimetype
  - serving static images
  - restricting file access
  - streaming data vs preloading data
  - generating pdf files with data
  - deleting files

- [Pagination]:
  - adding page query and setup
  - using mongoose skip and limit query
  - passing pagination parameters to view
  - adding dynamic pagination buttons
  - re-using pagination logic

- [Async-Request]:
  - adding client side js code
  - sending and handling background requests

- [Payment-With-Stripe]: - npm install --save stripe
  - adding checkout Page
  - setting up stripe

- [Rest-Api]:
  - Sending Get and Post Requests
  - Fixing Clients and CORS Errors

- [Advanced-Rest-Api] - npm install --save jsonwebtoken multer
  - Setting up React Frontend
  - Planning the Api
  - Serverside Validation
  - Model Setup
  - Database Storage
  - Static Images & Error Handling
  - Uploading Images
  - Pagination
  - Authentication with JWT(Json Web Token)
  - Authorization Checks and Middlewares

- [Async-Await]
  - Transforming "then - catch" to "async - await"

- [WebSockets-and-SocketIO] - npm install --save socket.io {{in react: socket.io-client}} 

  - Setup
  - Establishing Connection
  - Realtime with emit and broadcast

- [GraphQL] - npm install --save graphql express-graphql validator
  - Setup
  - GraphQL VS Rest
  - Schema and Resolvers
  - Root and Mutation Query

- [Deployment]
  - Using Environment Variables
  - Using Production Api Keys
  - Setting Secure Response Headers with Helmet - (npm install --save helmet)
  - Compressing Assets (npm install --save compression)
  - Setting up Request Logging (npm install --save morgan)
  - Deploying Api's
  
- [Testing] (npm install --save-dev chai mocha)
  - Setup
  - Testing Auth Middleware
  - Organizing Multiple Tests
  - What Not to Tests
  - Using stubs (npm install --save-dev sinon)
  - Testing Controllers, Async Code
  - Setup Testing Database
  - Testing with Active Database
  - Hooks
  - Testing Code That Requires Authentication

- [ES-Modules] 
  - setting up in package.json
  - import and export usage

- [Typescript] (sudo npm install -g typescript)
  - setting up typescript (npm install --save typescript)
  [TYPESCRIPT-NODE]
    - tsc —init // initialise typescript
    - npm init //initialise package.json
    - npm install --save express body-parser
    - npm install —save-dev @types/node
    - npm install —save-dev @types/express

    In tsconfig.json :
      “target”:”es6”,
      “module”:”commonJs”,
      “moduleResolution”:”node”

- [Deno] (brew install deno)
  - to start a deno app run the following command >> deno run app.ts
  - Runtime (Namespace) Api

