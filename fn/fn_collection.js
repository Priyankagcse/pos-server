const JSONEXTRACT = {
    name: 'JSONEXTRACT',
    fnName: `CREATE FUNCTION JSONEXTRACT(reqObj JSON, searchKey varchar(50))
            RETURNS longtext
            BEGIN
                DECLARE resObj longtext DEFAULT (JSON_EXTRACT(reqObj, searchKey));
                RETURN resObj;
            END`
}

const JSONUNQUOTE = {
    name: 'JSONUNQUOTE',
    fnName: `CREATE FUNCTION JSONUNQUOTE(reqObj JSON, searchKey varchar(50))
            RETURNS longtext
            BEGIN
                DECLARE resObj longtext DEFAULT JSON_UNQUOTE(JSONEXTRACT(reqObj, searchKey));
                RETURN resObj;
            END`
}

const STRTODATE = {
    name: 'STRTODATE',
    fnName: `CREATE FUNCTION STRTODATE(reqDate VARCHAR(50))
            RETURNS datetime
            BEGIN
                DECLARE resDate datetime DEFAULT STR_TO_DATE(reqDate, '%Y-%m-%dT%H:%i:%s.000Z');
                RETURN resDate;
            END`
}

const all_fns = [
    JSONEXTRACT,
    JSONUNQUOTE,
    STRTODATE
]

module.exports = all_fns