var {connectMongo,connectMySql} = require('../db/DatabaseConnections.js');

var getAllQuery = "SELECT * FROM transactions ";
var sumQuery = "SELECT SUM(fill_qty) AS SUM FROM transactions ";
var unionMainQuery = "SELECT * FROM transactions ";
var unionSortQueryASC = " ORDER BY lastModifiedDate ASC LIMIT 1";
var unionSortQueryDESC = " ORDER BY lastModifiedDate DESC LIMIT 1";

module.exports={
    getResultsFromDB:function(rewindTime,currentTime,operation){
        return new Promise((resolve, reject) => {
            if(operation=="sumQuery"){
                var query = `${sumQuery} WHERE lastModifiedDate BETWEEN  '${rewindTime}' AND '${currentTime}'`;
                console.log(`Sum Query: ${query}`);
            }
            else if (operation =="getAllQuery"){
                var query = `${getAllQuery} WHERE lastModifiedDate BETWEEN  '${rewindTime}' AND '${currentTime}'`;
                console.log(`Get All Query: ${query}`);
            }
            else if(operation=="unionQuery"){
                var query1 = `(${unionMainQuery} WHERE lastModifiedDate BETWEEN '${rewindTime}' AND '${currentTime}' ${unionSortQueryASC})`;
                var query2 = `(${unionMainQuery} WHERE lastModifiedDate BETWEEN '${rewindTime}' AND '${currentTime}' ${unionSortQueryDESC})`;
                var query = `${query1} UNION ${query2}`;
                console.log(`Union Query: ${query}`);
            }

            //DB Call
            connectMySql().then((con)=>{
                con.connect(function(err) {
                    con.query(query,function(err,rows){
                        if (err) {
                               reject(err);
                        }
                        else {
                               resolve(rows);
                        }
                    });
                });
            }).catch((err)=>{
                console.log(err);
            });
        });
    }
};
