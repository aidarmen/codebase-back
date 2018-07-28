module.exports = {
    server: {
            host        : 'localhost',
            port        : 3060
    },
    database: {
        host            : 'localhost',
        port            : 27017,
        url             : 'mongodb://127.0.0.1:27017/codebase'
    },
    auth: {
        JWT_SECRET      : '1982LvDSm44Xv2jYwOh93Y37LvDSm4XvjYOhq9Yq',
        privateKey      : '37LvDSm4XvjYOh9Y1982LvDSm44Xv2jYqOh93Yw37LvDSm4XvjYOh9Y',
        tokenExpiry     : 144000
    }



}