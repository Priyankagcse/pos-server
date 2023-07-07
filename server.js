const { initialRefresh } = require('./common');
const { app, db, uuidv4 } = require('./config');

// app.get("/", (req, res) => {
//     res.send('Welcome');
// });

let userUuid = '';

function tableSpRefresh() {
    const spRefresh = require('./sp-index');
    spRefresh(null, () => {
        const tableRefresh = require('./table-index');
        tableRefresh(null);
    });
}
tableSpRefresh();

function isNullOrUndefinedOrEmpty(value) {
    return value === undefined || value === null || value === '';
}

app.get("/versionRefresh/:version/:userUuid", (parentReq, parentRes) => {
    const parentInsert = `SELECT * FROM versionupdate`;
    db.query(parentInsert, (parentErr, parentResult) => {
        if (parentErr) {
            parentRes.status(400).send({ message: parentErr.sqlMessage });
        } else {
            if (isNullOrUndefinedOrEmpty(parentResult[0])) {
                const bodyData = { version: parentReq.params.version, lastModifiedOn: new Date() };
                const sqlInsert = "INSERT INTO versionupdate SET ?";
                db.query(sqlInsert, bodyData, (err, result) => { 
                    if (err) {
                        res.status(400).send({ message: err.sqlMessage });
                    } else {
                        initialRefresh(parentRes, parentReq.params.userUuid);
                    }
                });
            } else if (parentResult[0] && (+parentResult[0]['version'] !== +parentReq.params.version)) {
                const sqlUpdate = "UPDATE versionupdate SET version = ?, lastModifiedOn = NOW()";
                db.query(sqlUpdate, [parentReq.params.version], (updateErr, updateResult) => {
                    if (updateErr) {
                        parentRes.status(400).send({ message: updateErr.sqlMessage });
                    } else {
                        initialRefresh(parentRes, parentReq.params.userUuid);
                    }
                });
            } else {
                initialRefresh(parentRes, parentReq.params.userUuid);
            }
        }
    });
});

app.get("/getUser/:userUuid", (req, res) => {
    const uuid = uuidv4();
    userUuid = req.params.userUuid;
    const sqlInsert = `SELECT * from userlist u where u.uuid = '${userUuid}'`;
    db.query(sqlInsert, (err, result) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage });
        } else {
            res.send({ data: result[0][0], spentType: result[1], transferType: result[2] });
        }
    });
});

app.post("/user", (req, res) => {
    const uuid = uuidv4();
    const bodyData = {...req.body, uuid: uuid};
    const sqlInsert = "INSERT INTO userlist SET ?";
    db.query(sqlInsert, bodyData, (err, result) => { 
        if (err) {
            res.status(400).send({ message: err.sqlMessage });
        } else {
            res.send({ data: bodyData });
        }
    });
});

app.put("/user", (req, res) => {
    const uuid = req.body.uuid;
    const password = req.body.password;
    const lastModifiedOn = req.body.lastModifiedOn;
    const sqlInsert = "UPDATE userlist SET password = ?, lastModifiedOn = ? WHERE uuid = ?";
    db.query(sqlInsert, [password, lastModifiedOn, uuid], (err, result) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage });
        } else {
            res.send({ data: req.body });
        }
    });
});

app.listen(process.env.PORT, () => {
    console.log('Running on port 3002');
});

// app.listen(3002, () => {
//     console.log('Running on port 3002');
// });
