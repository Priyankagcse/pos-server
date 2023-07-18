const jsonExtract = {
    name: 'jsonExtract',
    fnName: `CREATE FUNCTION jsonExtract(dataObj JSON, searchKey varchar(50))
            RETURNS varchar(255)
            BEGIN
                DECLARE rtnObj JSON DEFAULT (JSON_EXTRACT(dataObj, CONCAT('$.', searchKey)));
                RETURN rtnObj;
            END`
}

const all_fns = [
    jsonExtract
]

module.exports = all_fns