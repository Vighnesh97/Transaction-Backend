var express = require('express');
var router = express.Router();
var {getResults} = require('../controller/TransactionController.js');

router.get('/rewindForHours', function(req, res,next) {
    if(req.query.hours){
        console.log(`Input Rewind Hours: ${req.query.hours}`);
        getResults(req.query.hours).then((result)=>{
            if(result.volume == undefined){
                res.send(`No Transactions for last ${req.query.hours} hours`);
            }
            res.json(result);
        }).catch((err)=>{
            next(err);
        });
    }
});
module.exports = router;
