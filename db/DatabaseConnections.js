module.exports = {
// Multiple Databases could be connected here
    connectMySql:function(){
        return new Promise((resolve, reject) => {
            var mysql = require('mysql');

            var con = mysql.createConnection({
              host: "localhost",
              user: "root",
              database: "crypt_transactions"
            });
            resolve(con);

            con.connect(function(err) {
              if (err) throw err;
              console.log("MySql DB Connected!");
              return con;
            });
        });
    }

};
