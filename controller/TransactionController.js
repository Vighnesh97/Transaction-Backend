var format = require('date-format');
var {getResultsFromDB} = require('../dao/TransactionDao.js');

 async function getResults(hours){
        try{
            var volume,open,close,high,low,high_low={};
            //Get the Range for which the DB will be Queried
            var today = new Date();
            var currentTime = new Date(today.getUTCFullYear(),today.getUTCMonth(),today.getUTCDate(),today.getUTCHours(),today.getUTCMinutes(),today.getUTCSeconds());
            var rewindTime = new Date(today.getUTCFullYear(),today.getUTCMonth(),today.getUTCDate(),
            today.getUTCHours()-hours,today.getUTCMinutes(),today.getUTCSeconds());
            rewindTime = format('yyyy-MM-dd hh:mm:ss', rewindTime);
            currentTime = format('yyyy-MM-dd hh:mm:ss', currentTime);
            console.log(`Time Range for Transactions Fetched: ${currentTime} To ${rewindTime}`);

            //Get the Volume value
            var rows = await getResultsFromDB(rewindTime,currentTime,"sumQuery");
            if(rows.length!=0){
                if(rows[0].SUM){// If sum is not there, Transactions in DB is assumed to be empty
                    volume = rows[0].SUM;
                }
            }


            rows = await getResultsFromDB(rewindTime,currentTime,"getAllQuery");

            //Calculate High and Low Values
            if(rows.length!=0){
                high_low = await getHighLowFromResult(rows);
                high = Math.round((high_low.high + Number.EPSILON) * 100) / 100;
                low = Math.round((high_low.low + Number.EPSILON) * 100) / 100;
            }

            rows = await getResultsFromDB(rewindTime,currentTime,"unionQuery");

            //Calculate Open and Close Values
            if(rows.length!=0){
                //If one transaction is done Both Open and Close value is the same
                if(rows.length == 1){
                    console.log(rows[0].fill_qty);
                    open = rows[0].fill_price/rows[0].fill_qty;
                    open = Math.round((open + Number.EPSILON) * 100) / 100;
                    close = open;
                }
                else {
                    console.log(rows[0].fill_qty,rows[1].fill_qty);
                    open = rows[0].fill_price/rows[0].fill_qty;
                    close = rows[1].fill_price/rows[1].fill_qty;
                    open = Math.round((open + Number.EPSILON) * 100) / 100;
                    close = Math.round((close + Number.EPSILON) * 100) / 100;
                }
            }

            console.log(`Result Values: Open: ${open} Close: ${close} High: ${high} Low: ${low} Volume: ${volume} `);
            var result={
                "open": open,
                "close": close,
                "high": high,
                "low": low,
                "volume": volume
            };
            return result;
        }
        catch(err){
            console.log(err);
        };
    }

    //Returns High and Low values for Transactions
    async function getHighLowFromResult(rows){
        var high = rows[0].fill_price/rows[0].fill_qty,
        low = high, pricePerCoin;
        for(var i=1;i<rows.length;i++){
            pricePerCoin = rows[i].fill_price/rows[i].fill_qty;
            if(pricePerCoin > high){
                high = pricePerCoin;
            }
            else if(pricePerCoin < low){
                low = pricePerCoin;
            }
        }
        var result={
            "high": high,
            "low" : low
        };
        return result;
    }
module.exports = {getResults};
