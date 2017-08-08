var sql = require('mssql/msnodesqlv8');

var config = {
  driver: 'msnodesqlv8',
  connectionString: 'Driver={SQL Server Native Client 11.0};Server={localhost};Database={SecristTestDB};Trusted_Connection={yes};'
}


function ExecuteSP(sp, parameter, json) {
  const pool = new sql.ConnectionPool(config, err => {
    pool.request()
      .input(parameter, sql.VarChar(8000), json)
      .execute(sp, (err) => {
        // ... error checks
        if (err) {
          console.log(err);
          var dt = new Date();
          var utcDate = dt.toUTCString();
          result = utcDate + ' -- ' + sp + ' failed.'
        }
        else {
          var dt = new Date();
          var utcDate = dt.toUTCString();
          result = utcDate + ' -- ' + sp + ' was successful.'
        }
        console.log(result);
      });
      if (err) {
        console.log(err);
      }
  });
}
