const { initialRefresh } = require('./common');
const { isNullOrUndefinedOrEmpty } = require('./common-fn');
const { app, db, uuidv4 } = require('./config');

// app.get("/", (req, res) => {
//     res.send('Welcome');
// });

function tableSpRefresh() {
    const spRefresh = require('./sp-index');
    spRefresh(null, () => {
        const tableRefresh = require('./table-index');
        tableRefresh(null);
    });
}
tableSpRefresh();

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
    let reqParams = req.params;    
    const sqlInsert = `SELECT * from userlist u where u.uuid = '${reqParams.userUuid}' and u.companyUuid = '${reqParams.companyUuid}'`;
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
    const putObj = req.body;
    const sqlInsert = "UPDATE userlist SET password = ?, lastModifiedOn = ? WHERE uuid = ? and companyUuid = ?";
    db.query(sqlInsert, [putObj.password, putObj.lastModifiedOn, putObj.uuid, putObj.companyUuid], (err, result) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage });
        } else {
            res.send({ data: req.body });
        }
    });
});

app.get("/product/:companyUuid", (req, res) => {
    let reqParams = req.params;
    const sqlInsert = `SELECT * from product p where p.companyUuid = '${reqParams.companyUuid}' order by createdOn desc`;
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
    const putObj = req.body;
    const sqlInsert = "UPDATE product SET productName = ?, productDescription = ?, partNumber = ?, gst = ?, price = ?, lastModifiedOn = ?, lastModifiedBy = ? WHERE uuid = ? and companyUuid = ?";
    db.query(sqlInsert, [putObj.productName, putObj.productDescription, putObj.partNumber, putObj.gst, putObj.price, putObj.lastModifiedOn, putObj.lastModifiedBy, putObj.uuid, putObj.companyUuid], (err, result) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage });
        } else {
            res.send({ data: req.body });
        }
    });
});

app.delete("/product", (req, res) => {
    const putObj = req.body;
    const sqlInsert = "DELETE FROM product where uuid = ? and companyUuid = ?";
    db.query(sqlInsert, [putObj.productUuid, putObj.companyUuid], (err, result) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage });
        } else {
            res.send({ data: req.body });
        }
    });
});

app.get("/productSearch/:companyUuid/:productName", (req, res) => {
    let reqParams = req.params;
    const sqlInsert = `SELECT * from product p where p.companyUuid = '${reqParams.companyUuid}' and p.productName like '%${reqParams.productName}%' order by createdOn desc`;
    db.query(sqlInsert, (err, result) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage });
        } else {
            res.send({ data: result });
        }
    });
});

app.get("/stock/:companyUuid", (req, res) => {
    let reqParams = req.params;
    const sqlInsert = `SELECT * from stock p where p.companyUuid = '${reqParams.companyUuid}' order by createdOn desc`;
    db.query(sqlInsert, (err, result) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage });
        } else {
            res.send({ data: result });
        }
    });
});

app.post("/stock", (req, res) => {
    const uuid = uuidv4();
    const bodyData = {...req.body, uuid: uuid};
    const sqlInsert = "INSERT INTO stock SET ?";
    db.query(sqlInsert, bodyData, (err, result) => { 
        if (err) {
            res.status(400).send({ message: err.sqlMessage });
        } else {
            res.send({ data: bodyData });
        }
    });
});

app.put("/stock", (req, res) => {
    const putObj = req.body;
    const sqlInsert = "UPDATE stock SET stock = ?, lastModifiedOn = ?, lastModifiedBy = ? WHERE uuid = ? and companyUuid = ?";
    db.query(sqlInsert, [putObj.stock, putObj.lastModifiedOn, putObj.lastModifiedBy, putObj.uuid, putObj.companyUuid], (err, result) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage });
        } else {
            res.send({ data: req.body });
        }
    });
});

app.delete("/stock", (req, res) => {
    const putObj = req.body;
    const sqlInsert = "DELETE FROM stock where uuid = ? and companyUuid = ?";
    db.query(sqlInsert, [putObj.productUuid, putObj.companyUuid], (err, result) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage });
        } else {
            res.send({ data: req.body });
        }
    });
});