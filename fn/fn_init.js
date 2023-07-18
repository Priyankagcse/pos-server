const { db, DBName } = require('../config');
const all_fns = require("./fn_collection");
const Sp = require('../sprocs/sprocs_class/sproc_base');

class fn_refresh {
    constructor() {
        this.connection = new Sp();
        this.fns = all_fns;
        this.init = this.init.bind(this);
        this.refresh = async(res = null, callBack) => {
            try {
                for (let fns of this.fns) {
                    const dropped = await this.connection.connection_query(`DROP FUNCTION IF EXISTS ${fns.name}`);
                    if (dropped) {
                        const updated = await this.connection.connection_query(`${fns.fnName}`);
                        if (updated) {
                            //
                        }
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

const fn = new fn_refresh();
module.exports = fn.init;