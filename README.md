# ColaCo's vending-machine
Steps to run locally:
1. git clone into an empty folder
2. In the terminal, cd into the new folder you just cloned
3. Paste in the .env file that was sent in the email
4. Create a new folder "secrets" and paste the vending-machine json file that was sent in the email into the newly-created "secrets" folder
5. Run "npm install" in the terminal
6. Run "npm run start" in the terminal. The server will start listening on localhost:5000.
7. Open a second or split terminal. The following steps will take place in the new terminal.
8. In the second terminal, cd into client
9. Run "npm install" in the second terminal
10. Run "npm run start" in the second terminal
11. The application should open automatically after a few seconds, but if it doesn't then go to localhost:3000.

There are a total of 7 endpoints for this application. They are:
- GET /sodas
  - Will return all of the sodas from the database. This includes all of their information (productName, description, cost, max, and remaining).
- POST /soda
  - Requires a json body with the "productName" field.
  - Will decrease the remaining quantity by 1 and return the information of the soda that was just "purchased".
  - Codes:
    - 200: Successfully decreased the remaining quantity by 1 and has returned the information of the purchased soda.
    - 201: The soda is out of stock (has 0 remaining in the vending machine).
    - 400: Missing necessary information from the body (productName)
    - 401: The name provided in the body could not be found in the database.
- POST /login
  - Requires a json body with the "password" field.
  - Will authenticate the user by returning a token which is used to access the rest of the endpoints below.
  - Codes:
    - 200: Password was correct and the token was returned.
    - 400: Missing necessary information from the body (password)
    - 401: The password was incorrect
    - 500: Something went wrong on the server's end. Please try again later.
- POST /restock
  - Requires authentication via bearer token (the one returned from a 200 status on the POST /login endpoint).
  - Requires a json body with the "productName" and "quantity" fields.
  - Will increase the remaining quantity of the soda requested by the amount specified from the "quantity" field as long as it doesn't surpass the max amount of the specified sodas the vendin machine can hold.
  - Codes:
    - 200: The soda was restocked and the updated information of the soda was returned.
    - 400: Either the user is unauthenticated (missing token) or missing necessary information from the body (productName and quantity).
    - 401: The name provided in the body could not be found in the database.
    - 402: The quantity provided was too great and would cause he vending to "overflow" by surpassing the max quantity allowed.
- POST /product-update
  - Requires authentication via bearer token (the one returned from a 200 status on the POST /login endpoint).
  - Requires a json body with the "productName" and "newCost" fields.
  - Updates the cost of the specified soda based on the new cost provided in the "newCost" field.
  - Codes: 
    - 200: Was successfull in pudating the price and has returned the information on the updated soda.
    - 400: Either the user is unauthenticated (missing token) or missing necessary information from the body (productName and newCost).
    - 401: The name provided in the body could not be found in the database
- POST /new-product
  - Requires authentication via bearer token (the one returned from a 200 status on the POST /login endpoint).
  - Requires a json body with the "productName", "description", "cost", and "max" fields.
  - Creates a new soda with the information inculded in the body and saves it in the database. Please note that every newly-creted soda will start at "0 remaining". That means the admin will have to restock some of it before a user is able to puchase that soda.
  - Codes: 
    - 200: Was successfull in creating the new soda returned the information on th newly-created soda.
    - 400: Either the user is unauthenticated (missing token) or missing necessary information from the body (productName, description, cost, and max).
    - 401: Another soda with the same name is alredy in the database.
- DELETE /product-removal
  - Requires authentication via bearer token (the one returned from a 200 status on the POST /login endpoint).
  - Requires a json body with the "productName" field.
  - Removes the specified soda from the database.
  - Codes: 
    - 200: Was successfull in removing the specified soda and returns a message stating that it was successfull.
    - 400: Either the user is unauthenticated (missing token) or missing necessary information from the body (productName).
    - 401: The name provided in the body could not be found in the database.

- User Interface:
  - Vending Machine:
    - When using the application, you will see a vending machine with the glass and sodas on the left side and the keypad panel and admin key on the right side. 
    - Use the keypad to input the code corresponding to the soda you wish to purchase (01, 02, etc.) and press "Purchase". If it is a valid code and in stock, it will download a json file containing the details of the soda that was just purchased.
    - You can click on the button with a key icon to be prompted with the admin password. Entering it correctly will grant you an admin's view of the vending machine. The keypad will be gone and replaces with a white box instructing to select a soda. This white box will contain the form you need to fill depending on the task you wish to complete.
  - Admin Vending Machine:
    - You will notice an extra "card" with a "plus" icon on the left side before the first soda. Clicking on the extra card will allow you to add a new soda by filling in the form that appears on the right and submitting. If the name is unique and all of the fields are filled, it will rerender the page with the newly-created soda included on the left side. If there are any errors, they will be displayed via a popup.
    - You may also select any of the sodas on the left side to make the right side fill with a card containing the details of the soda you selected and options to select from. These options include restocking, editing the price, and removing the soda from the vending machine.
    - Clicking on any of the options will prompt a second form right below the first one. If you fill the required fields and submit, it will execute the task you selected. If there are any errors, they will be displayed via a popup.
    - To exit the admin's view of the vending machine, simply click on the "logout/exit" button on the right side.
