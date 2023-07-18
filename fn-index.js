function refresh(response, callBack) {
    try {
        const fn_init = require('./fn/fn_init');
        fn_init(response, callBack);
    } catch(err) {
        console.log(err.message);
    }
}

module.exports = refresh;