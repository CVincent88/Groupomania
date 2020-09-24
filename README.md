# Groupomania

Make sure MySql is running.

Create user in MySql (or use one existing)

Install Node.js on your machine.

Clone the project on your machine.


 - Create a .env file in Groupomania/backend with the following configuration:

#######

NODE_ENV=development

DB_HOST=localhost

DB_USERNAME=yourMysqlUsername

DB_PASSWORD=yourMysqlPassword

DB_DATABASE=Groupomania

DB_DIALECT=mysql

JWT_KEY=yourJWTKey

#######



 - To start the server, go to /Groupomania/backend:

--> npm install

--> npm run start.


 - To start Vue, with a second command line, go to /Groupomania/client:

 --> npm install

 --> npm run serve.


 - To create an admin account:

Create a regular account directly on the app.

Then, from MySql command line, type:

UPDATE users SET isAdmin = 1 WHERE emailAddress = 'yourEmailAddress';