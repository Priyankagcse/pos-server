const { db, DBName } = require('../config');
const all_tables = require("./table_collection");

class table_refresh {
    constructor() {
        this.init = this.init.bind(this);
        this.refresh = async(res = null, callBack) => {
            try {
                for (let table of all_tables) {
                    const sqlInsert = `CALL tableCheck('${DBName}', '${table.name}')`;
                    await db.query(sqlInsert, async(err, result) => {
                        if (result[0][0]['ALTER'] === "ALTER") {
                            const sqlColumns = `SHOW COLUMNS FROM ${table.name}`;                            
                            await db.query(sqlColumns, async(columnsErr, columnsResult) => {
                                if (columnsErr) {
                                    // console.log('Columns ' + columnsErr.sqlMessage);
                                } else {
                                    let fieldListStr = '';
                                    let modifyListStr = '';
                                    for (var j = 0; j < table.queryList.length; j++) {
                                        let filterData = columnsResult.filter((cols) => cols.Field === table.queryList[j]['field']);
                                        if (filterData.length === 0) {
                                            fieldListStr += `${table.queryList[j]['field']} ${table.queryList[j]['type']} ${table.queryList[j]['null']},`;
                                        } else {
                                            if (filterData[0]['Type'] !== table.queryList[j]['type']) {
                                                modifyListStr += `MODIFY COLUMN ${table.queryList[j]['field']} ${table.queryList[j]['type']},`;
                                            }
                                        }
                                    }
                                    fieldListStr = fieldListStr.replace(/.$/,"");
                                    modifyListStr = modifyListStr.replace(/.$/,"");
                                    if (fieldListStr) {
                                        const sqlAlter = `ALTER TABLE ${table.name} ADD (${fieldListStr})`;
                                        await db.query(sqlAlter, async(alterErr, alterResult) => {
                                            if (alterErr) {
                                                // console.log(`${sqlAlter} ${alterErr.sqlMessage}`);
                                            } else {
                                                if (modifyListStr) {
                                                    const sqlModify = `ALTER TABLE ${table.name} ${modifyListStr}`;
                                                    await db.query(sqlModify, (modifyErr, modifyResult) => {
                                                        if (modifyErr) {
                                                            // console.log(`${sqlModify} ${modifyErr.sqlMessage}`);
                                                        } else {
                                                            //
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    } else {
                                        if (modifyListStr) {
                                            const sqlModify = `ALTER TABLE ${table.name} ${modifyListStr}`;
                                            await db.query(sqlModify, (modifyErr, modifyResult) => {
                                                if (modifyErr) {
                                                    // console.log(`${sqlModify} ${modifyErr.sqlMessage}`);
                                                } else {
                                                    //
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        } else {
                            let fieldList = table.queryList.map((line) => {
                                return `${line.field} ${line.type} ${line.null}`;
                            });
                            let fieldListStr = fieldList.join(',')
                            let queryFormat = fieldListStr;
                            if (table.query) {
                                queryFormat += `, ${table.query}`;
                            }
                            const sqlCreate = `CREATE TABLE ${table.name} (${queryFormat});`;
                            await db.query(sqlCreate, (createErr, createResult) => {
                                if (createErr) {
                                    // console.log('Create ' + createErr.sqlMessage);
                                } else {
                                    //
                                }
                            });
                        }
                    });
                }
            } catch(err) {
                //
            } finally {
                callBack && callBack();
            }
        }
    }

    init(response, callBack) {
        return this.refresh(response, callBack);
    }
}

const tb = new table_refresh();
module.exports = tb.init;