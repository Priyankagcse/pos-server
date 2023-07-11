const { initialRefresh } = require('./common');
const { app, db, uuidv4 } = require('./config');

// app.get("/", (req, res) => {
//     res.send('Welcome');
// });

let userUuid = '';
let companyUuid = '';

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

app.get("/getUser/:userUuid/:companyUuid", (req, res) => {
    userUuid = req.params.userUuid;
    companyUuid = req.params.companyUuid;
    const sqlInsert = `SELECT * from userlist u where u.uuid = '${userUuid}' and u.companyUuid = '${companyUuid}'`;
    db.query(sqlInsert, (err, result) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage });
        } else {
            res.send({ data: result[0] });
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
    const companyUuid = req.body.companyUuid;
    const sqlInsert = "UPDATE userlist SET password = ?, lastModifiedOn = ? WHERE uuid = ? and companyUuid = ?";
    db.query(sqlInsert, [password, lastModifiedOn, uuid, companyUuid], (err, result) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage });
        } else {
            res.send({ data: req.body });
        }
    });
});

app.get("/product", (req, res) => {
    const sqlInsert = `SELECT * from product p where p.companyUuid = '${companyUuid}'`;
    db.query(sqlInsert, (err, result) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage });
        } else {
            res.send({ data: result });
        }
    });
});

app.post("/product", (req, res) => {
    const uuid = uuidv4();
    const bodyData = {...req.body, uuid: uuid};
    const sqlInsert = "INSERT INTO product SET ?";
    db.query(sqlInsert, bodyData, (err, result) => { 
        if (err) {
            res.status(400).send({ message: err.sqlMessage });
        } else {
            res.send({ data: bodyData });
        }
    });
});

app.put("/product", (req, res) => {
    const lastModifiedOn = req.body.lastModifiedOn;
    const uuid = req.body.uuid;
    const companyUuid = req.body.companyUuid;
    const sqlInsert = "UPDATE product SET productName = ?, productDescription = ?, partNumber = ?, gst = ?, price = ?, lastModifiedOn = ? WHERE uuid = ? and companyUuid = ?";
    db.query(sqlInsert, [productName, productDescription, partNumber, gst, price, lastModifiedOn, uuid, companyUuid], (err, result) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage });
        } else {
            res.send({ data: req.body });
        }
    });
});

app.delete("/product", (req, res) => {
    const productUuid = req.body.uuid;
    const sqlInsert = "DELETE FROM product where uuid = ? and companyUuid = ?";
    db.query(sqlInsert, [productUuid, companyUuid], (err, result) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage });
        } else {
            res.send({ data: req.body });
        }
    });
});