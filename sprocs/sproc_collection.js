const INITIALREFRESH = {
    name: 'INITIALREFRESH',
    query: `CREATE PROCEDURE initialRefresh(userUuid varchar(50))
            BEGIN
                SELECT * FROM userlist;
                SELECT * FROM menulist WHERE isActive = 1 order by orderNo asc;
                SELECT * FROM company;
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
                
                DECLARE stockList JSON DEFAULT (JSONEXTRACT(stockObj, '$.stockList'));
                DECLARE stockLength INT DEFAULT JSON_LENGTH(stockList);
                
                WHILE i < stockLength DO
                
                    SET @uuid = (select uuid());
                    
                    SET lastModifiedOnValue = JSONUNQUOTE(stockList, CONCAT('$[', i, '].lastModifiedOn'));        
                    IF DATE(lastModifiedOnValue) IS NOT NULL THEN
                        SET lastModifiedOnDateTime = STRTODATE(lastModifiedOnValue);
                    ELSE
                        SET lastModifiedOnDateTime = NULL;
                    END IF;
                    
                    SET createdOnValue = JSONUNQUOTE(stockList, CONCAT('$[', i, '].createdOn'));
                    IF DATE(createdOnValue) IS NOT NULL THEN
                        SET createdOnDatetime = STRTODATE(createdOnValue);
                    ELSE
                        SET createdOnDatetime = NULL;
                    END IF;
                    
                    INSERT INTO stock (uuid, userUuid, companyUuid, productUuid, uom, stock, isActive, createdOn, createdBy, lastModifiedOn, lastModifiedBy)
                        VALUES (@uuid, JSONUNQUOTE(stockObj, '$.userUuid'), JSONUNQUOTE(stockObj, '$.companyUuid'),
                            JSONUNQUOTE(stockList, CONCAT('$[', i, '].uuid')), JSONUNQUOTE(stockList, CONCAT('$[', i, '].uom')),
                            JSONUNQUOTE(stockList, CONCAT('$[', i, '].stock')), 1, createdOnDatetime,
                            JSONUNQUOTE(stockList, CONCAT('$[', i, '].createdBy')), lastModifiedOnDateTime,
                            JSONUNQUOTE(stockList, CONCAT('$[', i, '].lastModifiedBy')));
                    
                    SET i = i + 1;
                END WHILE;
            END`
}

const GETPRODUCT = {
    name: 'GETPRODUCT',
    query: `CREATE PROCEDURE getProduct(IN productObj JSON)
            BEGIN
                SET @companyUuid = JSONUNQUOTE(productObj, '$.companyUuid');
                SET @startPageLimit = JSONUNQUOTE(productObj, '$.startPageLimit');
                SET @endPageLimit = JSONUNQUOTE(productObj, '$.endPageLimit');
                SET @maxRowLimit = JSONUNQUOTE(productObj, '$.maxRowLimit');
                SET @caller = IFNULL(JSONUNQUOTE(productObj, '$.caller'), '');
                SET @searchText = IFNULL(concat('%', JSONUNQUOTE(productObj, '$.searchText'), '%'), '');
                SET @sortColumn = concat(' ', IFNULL(JSONUNQUOTE(productObj, '$.sortColumn'), ''));
                SET @sortType = concat(' ', IFNULL(JSONUNQUOTE(productObj, '$.sortDirection'), ''));
                
                IF @caller = 'prodSearch' THEN
                    SET @count = (select COUNT(uuid) as count from product p where p.companyUuid = @companyUuid and (p.productName like @searchText or p.partNumber like @searchText));
                ELSE
                    SET @count = (select COUNT(uuid) as count from product p where p.companyUuid = @companyUuid);
                END IF;
                
                IF @count > @maxRowLimit THEN
                    SET @pagination = 1;
                    IF @caller = 'prodSearch' THEN
                        SET @query = CONCAT('SELECT * FROM product p where p.companyUuid = ? and (p.productName like ? or p.partNumber like ?) order by createdOn desc LIMIT ', @startPageLimit, ', ', @endPageLimit);
                    ELSEIF @caller = 'sort' THEN
                        SET @query = CONCAT('SELECT * FROM product p where p.companyUuid = ? order by ', @sortColumn, @sortType, ' LIMIT ', @startPageLimit, ', ', @endPageLimit);
                    ELSE
                        SET @query = CONCAT('SELECT * FROM product p where p.companyUuid = ? order by createdOn desc LIMIT ', @startPageLimit, ', ', @endPageLimit);
                    END IF;
                ELSE
                    SET @pagination = 0;
                    IF @caller = 'prodSearch' THEN
                        SET @query = CONCAT('SELECT * FROM product p where p.companyUuid = ? and (p.productName like ? or p.partNumber like ?) order by createdOn desc');
                    ELSEIF @caller = 'sort' THEN
                        SET @query = CONCAT('SELECT * FROM product p where p.companyUuid = ? order by ', @sortColumn, @sortType);
                    ELSE
                        SET @query = CONCAT('SELECT * FROM product p where p.companyUuid = ? order by createdOn desc');
                    END IF;
                END IF;
                    
                select @count as count, @pagination as pagination;
                PREPARE stmt FROM @query;
                IF @caller = 'prodSearch' THEN
                    EXECUTE stmt USING @companyUuid, @searchText, @searchText;
                ELSE
                    EXECUTE stmt USING @companyUuid;
                END IF;
                DEALLOCATE PREPARE stmt;  
            END`
}


const all_store_procedure = [
    INITIALREFRESH,
    STOCKBULKINSERT,
    GETPRODUCT
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