const menulist = {
    name: 'menulist',
    query: `PRIMARY KEY (uuid)`,
    queryList: [
        {field: 'userUuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'uuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'companyUuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'menuId', type: 'int', null: 'NOT NULL'},
        {field: 'menuName', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'orderNo', type: 'int', null: 'DEFAULT NULL'},
        {field: 'displayName', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'pathName', type: 'varchar(150)', null: 'NOT NULL'},
        {field: 'pathTemplate', type: 'varchar(150)', null: 'NOT NULL'},
        {field: 'isActive', type: 'boolean', null: 'NOT NULL'},
        {field: 'createdOn', type: 'datetime', null: 'NOT NULL'},
        {field: 'createdBy', type: 'varchar(50)', null: 'DEFAULT NULL'},
        {field: 'lastModifiedOn', type: 'datetime', null: 'DEFAULT NULL'},
        {field: 'lastModifiedBy', type: 'varchar(50)', null: 'DEFAULT NULL'}
    ]
}

const userlist = {
    name: 'userlist',
    query: `PRIMARY KEY (uuid)`,
    queryList: [
        {field: 'uuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'companyUuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'username', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'password', type: 'longtext', null: 'NOT NULL'},
        {field: 'phoneNumber', type: 'varchar(20)', null: 'NOT NULL'},
        {field: 'email', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'createdOn', type: 'datetime', null: 'NOT NULL'},
        {field: 'createdBy', type: 'varchar(50)', null: 'DEFAULT NULL'},
        {field: 'lastModifiedOn', type: 'datetime', null: 'DEFAULT NULL'},
        {field: 'lastModifiedBy', type: 'varchar(50)', null: 'DEFAULT NULL'}
    ]
}

const versionupdate = {
    name: 'versionupdate',
    query: `PRIMARY KEY (version)`,
    queryList: [
        {field: 'version', type: 'decimal(10,0)', null: 'NOT NULL'},
        {field: 'lastModifiedOn', type: 'datetime', null: 'DEFAULT NULL'},
        {field: 'lastModifiedBy', type: 'varchar(50)', null: 'DEFAULT NULL'}
    ]   
}

const company = {
    name: 'company',
    query: `PRIMARY KEY (uuid)`,
    queryList: [
        {field: 'uuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'companyName', type: 'varchar(100)', null: 'NOT NULL'},
        {field: 'orgName', type: 'varchar(100)', null: 'NOT NULL'},
        {field: 'createdOn', type: 'datetime', null: 'NOT NULL'},
        {field: 'createdBy', type: 'varchar(50)', null: 'DEFAULT NULL'},
        {field: 'lastModifiedOn', type: 'datetime', null: 'DEFAULT NULL'},
        {field: 'lastModifiedBy', type: 'varchar(50)', null: 'DEFAULT NULL'}
    ]   
}

const product = {
    name: 'product',
    query: `PRIMARY KEY (uuid)`,
    queryList: [
        {field: 'uuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'companyUuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'productName', type: 'varchar(100)', null: 'NOT NULL'},
        {field: 'productDescription', type: 'varchar(150)', null: 'DEFAULT NULL'},
        {field: 'partNumber', type: 'varchar(100)', null: 'NOT NULL'},
        {field: 'gst', type: 'DECIMAL(16,2)', null: 'DEFAULT NULL'},
        {field: 'price', type: 'DECIMAL(16,2)', null: 'NOT NULL'},
        {field: 'createdOn', type: 'datetime', null: 'NOT NULL'},
        {field: 'createdBy', type: 'varchar(50)', null: 'DEFAULT NULL'},
        {field: 'lastModifiedOn', type: 'datetime', null: 'DEFAULT NULL'},
        {field: 'lastModifiedBy', type: 'varchar(50)', null: 'DEFAULT NULL'},
        {field: 'uom', type: 'varchar(50)', null: 'DEFAULT NULL'}
    ]   
}

const stock = {
    name: 'stock',
    query: `PRIMARY KEY (uuid)`,
    queryList: [
        {field: 'uuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'userUuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'companyUuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'productUuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'uom', type: 'varchar(50)', null: 'DEFAULT NULL'},
        {field: 'stock', type: 'DECIMAL(16,2)', null: 'NOT NULL'},
        {field: 'isActive', type: 'boolean', null: 'DEFAULT NULL'},
        {field: 'createdOn', type: 'datetime', null: 'NOT NULL'},
        {field: 'createdBy', type: 'varchar(50)', null: 'DEFAULT NULL'},
        {field: 'lastModifiedOn', type: 'datetime', null: 'DEFAULT NULL'},
        {field: 'lastModifiedBy', type: 'varchar(50)', null: 'DEFAULT NULL'}
        
    ]   
}

const billheader = {
    name: 'billheader',
    query: `PRIMARY KEY (uuid)`,
    queryList: [
        {field: 'uuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'userUuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'companyUuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'billNumber', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'amount', type: 'DECIMAL(16,2)', null: 'NOT NULL'},
        {field: 'taxableAmount', type: 'DECIMAL(16,2)', null: 'DEFAULT NULL'},
        {field: 'tax', type: 'DECIMAL(16,2)', null: 'DEFAULT NULL'},
        {field: 'customerName', type: 'varchar(100)', null: 'DEFAULT NULL'},
        {field: 'phoneNumber', type: 'varchar(20)', null: 'DEFAULT NULL'},
        {field: 'address', type: 'varchar(250)', null: 'DEFAULT NULL'},
        {field: 'billDate', type: 'datetime', null: 'NOT NULL'},
        {field: 'discountAmt', type: 'DECIMAL(16,2)', null: 'DEFAULT NULL'},
        {field: 'discountPer', type: 'DECIMAL(16,2)', null: 'DEFAULT NULL'},
        {field: 'isActive', type: 'boolean', null: 'DEFAULT NULL'},
        {field: 'createdOn', type: 'datetime', null: 'NOT NULL'},
        {field: 'createdBy', type: 'varchar(50)', null: 'DEFAULT NULL'},
        {field: 'lastModifiedOn', type: 'datetime', null: 'DEFAULT NULL'},
        {field: 'lastModifiedBy', type: 'varchar(50)', null: 'DEFAULT NULL'}
    ]   
}

const billlines = {
    name: 'billlines',
    query: `PRIMARY KEY (uuid)`,
    queryList: [
        {field: 'uuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'userUuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'companyUuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'hdrUuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'productName', type: 'varchar(100)', null: 'NOT NULL'},
        {field: 'productDescription', type: 'varchar(150)', null: 'DEFAULT NULL'},
        {field: 'partNumber', type: 'varchar(100)', null: 'NOT NULL'},
        {field: 'qty', type: 'DECIMAL(16,2)', null: 'NOT NULL'},
        {field: 'gst', type: 'DECIMAL(16,2)', null: 'DEFAULT NULL'},
        {field: 'amount', type: 'DECIMAL(16,2)', null: 'NOT NULL'},
        {field: 'uom', type: 'varchar(50)', null: 'DEFAULT NULL'},
        {field: 'taxableAmount', type: 'DECIMAL(16,2)', null: 'DEFAULT NULL'},
        {field: 'tax', type: 'DECIMAL(16,2)', null: 'DEFAULT NULL'},
        {field: 'discountAmt', type: 'DECIMAL(16,2)', null: 'DEFAULT NULL'},
        {field: 'discountPer', type: 'DECIMAL(16,2)', null: 'DEFAULT NULL'},
        {field: 'createdOn', type: 'datetime', null: 'NOT NULL'},
        {field: 'createdBy', type: 'varchar(50)', null: 'DEFAULT NULL'},
        {field: 'lastModifiedOn', type: 'datetime', null: 'DEFAULT NULL'},
        {field: 'lastModifiedBy', type: 'varchar(50)', null: 'DEFAULT NULL'}
    ]   
}

const all_tables = [
    menulist,
    userlist,
    versionupdate,
    company,
    product,
    stock,
    billheader,
    billlines
]

module.exports = all_tables