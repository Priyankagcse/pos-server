const { app, db } = require('./config');

// app.get("/", (req, res) => {
//     res.send('Welcome');
// });

db.getConnection((err) => {
    if (err) {
      console.error('Error connecting to MySQL server:', err);
      return;
    }
    console.log('Connected to MySQL server');
});

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

// app.listen(process.env.PORT, () => {
//     console.log('Running on port 3002');
// });

app.listen(3002, () => {
    console.log('Running on port 3002');
});
