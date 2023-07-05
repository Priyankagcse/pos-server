const menulist = {
    name: 'menulist',
    query: `PRIMARY KEY (uuid)`,
    queryList: [
        {field: 'userUuid', type: 'varchar(50)', null: 'DEFAULT NULL'},
        {field: 'uuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'menuId', type: 'int', null: 'DEFAULT NULL'},
        {field: 'menuName', type: 'varchar(20)', null: 'DEFAULT NULL'},
        {field: 'orderNo', type: 'int', null: 'DEFAULT NULL'},
        {field: 'displayName', type: 'varchar(20)', null: 'DEFAULT NULL'},
        {field: 'pathName', type: 'varchar(45)', null: 'DEFAULT NULL'},
        {field: 'pathTemplate', type: 'varchar(45)', null: 'DEFAULT NULL'},
        {field: 'isActive', type: 'int', null: 'DEFAULT NULL'}
    ]
}

const userlist = {
    name: 'userlist',
    query: `PRIMARY KEY (uuid)`,
    queryList: [
        {field: 'uuid', type: 'varchar(50)', null: 'NOT NULL'},
        {field: 'username', type: 'varchar(15)', null: 'NOT NULL'},
        {field: 'password', type: 'longtext', null: 'NOT NULL'},
        {field: 'phoneNumber', type: 'varchar(15)', null: 'DEFAULT NULL'},
        {field: 'email', type: 'varchar(30)', null: 'DEFAULT NULL'},
        {field: 'createdOn', type: 'datetime', null: 'DEFAULT NULL'},
        {field: 'lastModifiedOn', type: 'datetime', null: 'DEFAULT NULL'}
    ]
}

const versionupdate = {
    name: 'versionupdate',
    query: `PRIMARY KEY (version)`,
    queryList: [
        {field: 'version', type: 'decimal(10,0)', null: 'NOT NULL'},
        {field: 'lastModifiedOn', type: 'datetime', null: 'DEFAULT NULL'}
    ]   
}

const all_tables = [
    menulist,
    userlist,
    versionupdate
]

module.exports = all_tables