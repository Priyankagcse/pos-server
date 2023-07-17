const { db } = require("./config");

function initialRefresh(parentRes, userUuid) {
    const sqlInsert = `CALL initialRefresh('${userUuid}')`;
    db.query(sqlInsert, (err, result) => {
        if (err) {
            parentRes.status(400).send({ message: err.sqlMessage });
        } else {
            parentRes.send({ userList: result[0], menuList: result[1], companyData: result[2] });
        }
    });
}

module.exports = { initialRefresh };