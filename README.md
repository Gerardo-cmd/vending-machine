
# colaco's vending-machine
Steps to run locally:
1. git clone into an empty folder
2. run "npm install"
3. cd into client
4. run "npm install" again
5. cd ..
6. run "npm run start"

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
  - Requires authentication via bearer token (the one returned from a 200 status on the POST /login endpoint)
  - Requires a json body with the "productName" and "quantity" fields.
  - Will increase the remaining quantity of the soda requested by the amount specified from the "quantity" field as long as it doesn't surpass the max amount of the specified sodas the vendin machine can hold
  - Codes:
    - 200: The soda was restocked and the updated information of the soda was returned.
    - 400: Either the user is unauthenticated (missing token) or missing necessary information from the body (productName and quantity).
    - 401: The name provided in the body could not be found in the database.
    - 402: The quantity provided was too great and would cause he vending to "overflow" by surpassing the max quantity allowed.
- POST /product-update
  - Requires authentication via bearer token (the one returned from a 200 status on the POST /login endpoint)
  - Requires a json body with the "productName" and "newCost" fields.
  - Updates the cost of the specified soda based on the new cost provided in the "newCost" field.
  - Codes: 
    - 200: Was successfull in pudating the price and has returned the information on the updated soda.
    - 400: Either the user is unauthenticated (missing token) or missing necessary information from the body (productName and newCost).
    - 401: The name provided in the body could not be found in the database
- POST /new-product
  - Requires authentication via bearer token (the one returned from a 200 status on the POST /login endpoint)
  - Requires a json body with the "productName", "description", "cost", and "max" fields.
  - Creates a new soda with the information inculded in the body and saves it in teh database. Please note that every new;ly-creted soda will start at 0 remaining. That means the admin will have to restock some of it before a user is able to puchase that soda.
  - Codes: 
    - 200: Was successfull in creating the new soda returned the information on th newly-created soda.
    - 400: Either the user is unauthenticated (missing token) or missing necessary information from the body (productName, description, cost, and max).
    - 401: Another soda with the same name is alredy in the database.
- DELETE /product-removal
  - Requires authentication via bearer token (the one returned from a 200 status on the POST /login endpoint)
  - Requires a json body with the "productName" field.
  - Removes the specified soda from the database
  - Codes: 
    - 200: Was successfull in removing the specified soda and returns a message stating that it was successfull.
    - 400: Either the user is unauthenticated (missing token) or missing necessary information from the body (productName).
    - 401: The name provided in the body could not be found in the database.