## DrizzleORM and Database setup

- Install `DrizzleORM` and initial setup [x]

### **DONE** Migrations [x]

- **DONE** Add Drizzle Kit package and configuration for it [x]
- **DONE** Add migration script that will handle pushing the schema changes (migrations) to the database [x]
- **DONE** Add npm scripts for triggering the migration [x]

### **DONE** Seeding functionality [x]

- **DONE** Add npm script to trigger seeding the database [x]
- **DONE** Add seeding functionality that will automatically pre-populate the database with mock Users data [x]
  - **DONE** Hash the passwords before storing them in the database when seeding the users [x]
- **DONE** Add function as a main entry point for seeding the database with all different types of mock data [x]

## Feature - Authentication & Authorization

### Sign Up

- **DONE** Create authentication service for handling account registration (sign up) [x]
- **DONE** Save newly created accounts in local database [x]
  - **DONE** Passwords need to be encrypted using `bcrypt` [x]
- **DONE** Connect sign up form with the corresponding API endpoint and service [x]

### Sign In & Sign Out w/ JWT

- **DONE** Implement authentication and authorization process using json web token [x]
  - **DONE** Without using third-party service such as NextAuth [x]
  - **DONE** JWT will be stored using cookies as an `HttpOnly` cookie [x]
  - **DONE** The `fetchHandler` should be updated to include credentials with each request [x]
- Create authentication service for handling user sign ins in the application
- Compare provided password with encrypted password saved in the database for the user trying to sign in
- **DONE** Add middleware protection for pages and API routes [x]
  - Currently only works for "/test" page
  - Pages & API endpoints that we want to protect should be included here
- Implement "Remember Me" functionality
  - To be included in the payload upon signin
  - If selected, set the expiration date to 1 year

### **DONE** Forgot & Reset Password [x]

- **DONE** Create service that will trigger sending an email containing a link
  that will redirect the user to the reset password page [x]
  - **DONE** This link will have a token attached to it [x]
  - **DONE** These tokens will be saved in a separate table in the database [x]
  - **DONE** Once the token is used it will automatically be removed from the database to prevent
    subsequent password resets. If a user wants to reset the password, they first must use the forgot password option [x]
  - **DONE** Send emails using Gmail SMTP [x]
- **DONE** Create service that will handle updating (resetting) the password for the targeted user [x]
- **DONE** Create API endpoin to use this service and connect the frontend 'client' form responsible for sending the API request [x]

- This table should be cleaned after X amount of time

### JWT

- Implement authentication with third party site such as Google
  - Without using third-party service such as NextAuth (??)
