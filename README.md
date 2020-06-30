This Service is for Handling Sample Transactions Use case

This Service currently contains one API
-> /rewindForHours
    This endpoint takes hours value as query parameter which

    For example: If hours = 2; the API will return (open, close, high, low, volume) between
    (now) and (now - 2) hrs
    and is used to return below response

    Response Object:
    {
        open: Price at which the market opened (1st trade)
        close: Last trade
        high: Highest market rate
        low: lowest market rate
        volume: Total quantity of volume traded
    }

    -This API will Query and give result based on UTC Time and the Time range considered based on Hours parameter will be "x" hours ago and current UTC time.

Setup:

-> Create a MySql Database on localhost with Following details

Database Name: "crypt_transactions",
Table Name: "transactions"

Table Structure:
https://github.com/Vighnesh97/Transaction-Backend/blob/master/images/table-structure.png?raw=true

Sample Transactions Table:
https://github.com/Vighnesh97/Transaction-Backend/blob/master/images/sample-table.png?raw=true

Steps to Hit the API
Step 1: Install Dependencies
Command: npm install

Step 2: Run Service
Command: npm run start

Step 3: Get API Example
Modify the hours parameter as per your need
"http://localhost:3000/rewindForHours?hours=2"
