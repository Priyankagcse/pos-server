const INITIALREFRESH = {
    name: 'INITIALREFRESH',
    query: `CREATE PROCEDURE initialRefresh(userUuid varchar(50))
            BEGIN
                SELECT * FROM userlist;
                SELECT * FROM menulist WHERE isActive = 1 order by orderNo asc;
            END`
}

const STOCKBULKINSERT = {
    name: 'STOCKBULKINSERT',
    query: `CREATE PROCEDURE stockBulkInsert(IN stockObj JSON)
            BEGIN
                DECLARE createdOnDatetime DATETIME;
                DECLARE createdOnValue VARCHAR(50);
                
                DECLARE lastModifiedOnDateTime DATETIME;
                DECLARE lastModifiedOnValue VARCHAR(50);
                
                DECLARE i int DEFAULT 0;
                
                DECLARE stockList JSON DEFAULT (JSON_EXTRACT(stockObj, '$.stockList'));
                DECLARE stockLength INT DEFAULT JSON_LENGTH(stockList);
                
                WHILE i < stockLength DO
                
                    SET @uuid = (select uuid());
                    
                    SET lastModifiedOnValue = JSON_UNQUOTE(JSON_EXTRACT(stockList, CONCAT('$[', i, '].lastModifiedOn')));        
                    IF DATE(lastModifiedOnValue) IS NOT NULL THEN
                        SET lastModifiedOnDateTime = STR_TO_DATE(lastModifiedOnValue, '%Y-%m-%dT%H:%i:%s.000Z');
                    ELSE
                        SET lastModifiedOnDateTime = NULL;
                    END IF;
                    
                    SET createdOnValue = JSON_UNQUOTE(JSON_EXTRACT(stockList, CONCAT('$[', i, '].createdOn')));
                    IF DATE(createdOnValue) IS NOT NULL THEN
                        SET createdOnDatetime = STR_TO_DATE(createdOnValue, '%Y-%m-%dT%H:%i:%s.000Z');
                    ELSE
                        SET createdOnDatetime = NULL;
                    END IF;
                    
                    INSERT INTO stock (uuid, userUuid, companyUuid, productUuid, uom, stock, isActive, createdOn, createdBy, lastModifiedOn, lastModifiedBy)
                        VALUES (@uuid, JSON_EXTRACT(stockObj, '$.userUuid'), JSON_EXTRACT(stockObj, '$.companyUuid'),
                            JSON_UNQUOTE(JSON_EXTRACT(stockList, CONCAT('$[', i, '].uuid'))),
                            JSON_UNQUOTE(JSON_EXTRACT(stockList, CONCAT('$[', i, '].uom'))), JSON_UNQUOTE(JSON_EXTRACT(stockList, CONCAT('$[', i, '].stock'))),
                            1, createdOnDatetime,
                            JSON_UNQUOTE(JSON_EXTRACT(stockList, CONCAT('$[', i, '].createdBy'))),
                            lastModifiedOnDateTime,
                            JSON_UNQUOTE(JSON_EXTRACT(stockList, CONCAT('$[', i, '].lastModifiedBy'))));      
                    
                    SET i = i + 1;
                END WHILE;
            END`
}

const all_store_procedure = [
    INITIALREFRESH,
    STOCKBULKINSERT
]

module.exports = all_store_procedure

/*
    You can only achieve some fast performance with stored procedure just because it is cached in sql server in binary form and only function call with para goes to sql every time

    Real performance you can achieve with efficient query 

    1. Sql partitioning of searching huge data **
    2. Instead of update use case
    3. Use temperory table for joins and delete them after use
    4. Avoid joins instead use sub query if possible **
    5. Avoid cursor,triggers
    6. Select exact amount of data needed
    7. Use stored procedures **
    8. Avoid distinct instead use group by self join **
    9. Use EXISTS instead of where IN
    10. Avoid subquery use CTE
*/