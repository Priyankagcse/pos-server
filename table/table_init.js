const { db, DBName } = require('../config');
const all_tables = require("./table_collection");
const Sp = require('../sprocs/sprocs_class/sproc_base');

class table_refresh {
    constructor() {
        this.connection = new Sp();
        this.tables = all_tables;
        this.init = this.init.bind(this);
        this.refresh = async(res = null, callBack) => {
            try {
                for (let table of this.tables) {
                    const sqlInsert = await this.connection.connection_query(`SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA LIKE '${DBName}' AND TABLE_NAME = '${table.name}'`);
                    if (sqlInsert.length) {
                        const sqlColumns = await this.connection.connection_query(`SHOW COLUMNS FROM ${table.name}`);
                        if (sqlColumns.length) {
                            let fieldListStr = '';
                            let modifyListStr = '';
                            for (var j = 0; j < table.queryList.length; j++) {
                                let filterData = sqlColumns.filter((cols) => cols.Field === table.queryList[j]['field']);
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
                                await this.connection.connection_query(`ALTER TABLE ${table.name} ADD (${fieldListStr})`);
                                if (modifyListStr) {
                                    await this.connection.connection_query(`ALTER TABLE ${table.name} ${modifyListStr}`);
                                }
                            } else {
                                if (modifyListStr) {
                                    await this.connection.connection_query(`ALTER TABLE ${table.name} ${modifyListStr}`);
                                }
                            }
                        }
                    } else {
                        let fieldList = table.queryList.map((line) => {
                            return `${line.field} ${line.type} ${line.null}`;
                        });
                        let fieldListStr = fieldList.join(',')
                        let queryFormat = fieldListStr;
                        if (table.query) {
                            queryFormat += `, ${table.query}`;
                        }
                        await this.connection.connection_query(`CREATE TABLE ${table.name} (${queryFormat});`);
                    }
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