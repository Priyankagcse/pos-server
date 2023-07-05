const { app, db } = require('./config');

// app.get("/", (req, res) => {
//     res.send('Welcome');
// });

// let userUuid = '';

function tableSpRefresh() {
    const spRefresh = require('./sp-index');
    spRefresh(null, () => {
        const tableRefresh = require('./table-index');
        tableRefresh(null);
    });
}
tableSpRefresh();

// function isNullOrUndefinedOrEmpty(value) {
//     return value === undefined || value === null || value === '';
// }

app.get("/userlist", (req, res) => {
    const sqlInsert = `select * from userlist`;
    db.query(sqlInsert, (err, result) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage });
        } else {
            res.send({ data: result });
        }
    });
});

app.listen(process.env.PORT, () => {
    console.log('Running on port 3002');
});

// app.listen(3002, () => {
//     console.log('Running on port 3002');
// });
