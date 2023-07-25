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

const BILLSAVE = {
    name: 'BILLSAVE',
    query: `CREATE PROCEDURE billSave(IN billObj JSON)
            BEGIN
                DECLARE createdOnDatetime DATETIME;
                DECLARE createdOnValue VARCHAR(50);
                
                DECLARE lastModifiedOnDateTime DATETIME;
                DECLARE lastModifiedOnValue VARCHAR(50);
                
                DECLARE billDateTime DATETIME;
                DECLARE billDateOnValue VARCHAR(50);
                
                DECLARE i int DEFAULT 0;
                
                DECLARE billLines JSON DEFAULT (JSONEXTRACT(billObj, '$.lines'));
                DECLARE billLinesLength INT DEFAULT JSON_LENGTH(billLines);
                
                DECLARE stockLineLength INT;
                
                SET @hdrUuid = (select uuid());
                
                SET @billNumber = (SELECT count(*) from billheader);
                
                SET billDateOnValue = JSONUNQUOTE(billObj, '$.billDate');        
                IF DATE(billDateOnValue) IS NOT NULL THEN
                    SET billDateTime = STRTODATE(billDateOnValue);
                ELSE
                    SET billDateTime = NULL;
                END IF;
                
                INSERT INTO billheader (uuid, userUuid, companyUuid, billNumber, amount, taxableAmount, tax, customerName,
                    phoneNumber, address, billDate, discountAmt, discountPer, isActive, createdOn, createdBy, lastModifiedOn, lastModifiedBy, status)
                    VALUES (@hdrUuid, JSONUNQUOTE(billObj, '$.userUuid'), JSONUNQUOTE(billObj, '$.companyUuid'),
                        CONCAT('B', LPAD((@billNumber + 1), 3, '0')), JSONUNQUOTE(billObj, '$.amount'),
                        JSONUNQUOTE(billObj, '$.taxableAmount'), JSONUNQUOTE(billObj, '$.tax'),
                        JSONUNQUOTE(billObj, '$.customerName'), JSONUNQUOTE(billObj, '$.phoneNumber'),
                        JSONUNQUOTE(billObj, '$.address'), billDateTime,
                        JSONUNQUOTE(billObj, '$.discountAmt'), JSONUNQUOTE(billObj, '$.discountPer'),
                        1, JSONUNQUOTE(billObj, '$.createdOn'), JSONUNQUOTE(billObj, '$.createdBy'),
                        JSONUNQUOTE(billObj, '$.lastModifiedOn'), JSONUNQUOTE(billObj, '$.lastModifiedBy'),
                        100
                    );
                
                SELECT * from billheader bh where bh.companyUuid = JSONUNQUOTE(billObj, '$.companyUuid') and uuid = @hdrUuid;
                
                WHILE i < billLinesLength DO
                    
                    SET @lineUuid = (select uuid());
                    
                    SET lastModifiedOnValue = JSONUNQUOTE(billLines, CONCAT('$[', i, '].lastModifiedOn'));        
                    IF DATE(lastModifiedOnValue) IS NOT NULL THEN
                        SET lastModifiedOnDateTime = STRTODATE(lastModifiedOnValue);
                    ELSE
                        SET lastModifiedOnDateTime = NULL;
                    END IF;
                    
                    SET createdOnValue = JSONUNQUOTE(billLines, CONCAT('$[', i, '].createdOn'));
                    IF DATE(createdOnValue) IS NOT NULL THEN
                        SET createdOnDatetime = STRTODATE(createdOnValue);
                    ELSE
                        SET createdOnDatetime = NULL;
                    END IF;
                                
                    INSERT INTO billlines (uuid, userUuid, companyUuid, hdrUuid, productName, productDescription, partNumber, qty,
                    gst, amount, uom, taxableAmount, tax, discountAmt, discountPer, createdOn, createdBy, lastModifiedOn, lastModifiedBy, status, productUuid)
                    VALUES (@lineUuid, JSONUNQUOTE(billObj, '$.userUuid'), JSONUNQUOTE(billObj, '$.companyUuid'), @hdrUuid,
                        LOOPJSONUNQUOTE(billLines, i, 'productName'), LOOPJSONUNQUOTE(billLines, i, 'productDescription'),
                        LOOPJSONUNQUOTE(billLines, i, 'partNumber'), LOOPJSONUNQUOTE(billLines, i, 'qty'),
                        LOOPJSONUNQUOTE(billLines, i, 'gst'), LOOPJSONUNQUOTE(billLines, i, 'price'),
                        LOOPJSONUNQUOTE(billLines, i, 'uom'), LOOPJSONUNQUOTE(billLines, i, 'taxableAmount'),
                        LOOPJSONUNQUOTE(billLines, i, 'tax'), LOOPJSONUNQUOTE(billLines, i, 'discountAmt'),
                        LOOPJSONUNQUOTE(billLines, i, 'discountPer'), createdOnDatetime,
                        LOOPJSONUNQUOTE(billLines, i, 'createdBy'), lastModifiedOnDateTime,
                        LOOPJSONUNQUOTE(billLines, i, 'lastModifiedBy'), 100, LOOPJSONUNQUOTE(billLines, i, 'uuid')
                    );
                    
                    SET @j = 0;
                    SET @stockLine = (SELECT 
                        (SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'uuid', uuid,
                                'stock', stock,
                                'productUuid', productUuid
                            )
                        ) AS json_result
                        FROM stock s where s.companyUuid = JSONUNQUOTE(billObj, '$.companyUuid') and s.productUuid = LOOPJSONUNQUOTE(billLines, i, 'uuid') and s.stock > 0 order by createdOn asc
                    ));
                    SET @stockLineLength = JSON_LENGTH(@stockLine);
                    SET @totalQty = LOOPJSONUNQUOTE(billLines, i, 'qty');
                    WHILE @j < @stockLineLength DO
                        IF LOOPJSONUNQUOTE(billLines, i, 'uuid') = LOOPJSONUNQUOTE(@stockLine, @j, 'productUuid') THEN
                            SET @stockCount = LOOPJSONUNQUOTE(@stockLine, @j, 'stock');
                            IF @stockCount > 0 THEN
                                IF @stockCount > @totalQty THEN
                                    SET @stockCount = @stockCount - @totalQty;
                                    SET @totalQty = 0;
                                ELSE
                                    SET @totalQty = @totalQty - @stockCount;
                                    SET @stockCount = @stockCount - @stockCount;                
                                END IF;
                                Update stock set stock = @stockCount where uuid = LOOPJSONUNQUOTE(@stockLine, @j, 'uuid');
                            END IF;
                        END IF;
                    SET @j = @j + 1;
                    END WHILE;
                    SET i = i + 1;
                END WHILE;
            END`
}

const all_store_procedure = [
    INITIALREFRESH,
    STOCKBULKINSERT,
    GETPRODUCT,
    BILLSAVE
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