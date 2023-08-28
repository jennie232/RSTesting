const { Sequelize } = require('sequelize');

module.exports = async (isDev, path, app) => {
    const sequelize = new Sequelize('database', 'radsource', 'radsource', {
        host: 'localhost',
        dialect: 'sqlite',
        storage: isDev
            ? path.join(__dirname, '../database/dev.db') // my root folder if in dev mode
            : path.join(app.getPath("userData"), "pro.db"), // the resources path if in production build
    });
    
    const db = {};
    
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
    
    await sequelize.authenticate().then(()=>{
        console.log('sqlite database connected');
    }).catch(err => {
        throw err;
    })

    try{
        db.setting = await require("./models/setting.model.js")(sequelize, Sequelize);
    }catch(err) {
        throw err;
    }
    
    return db;
}