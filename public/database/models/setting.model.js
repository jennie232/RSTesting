module.exports = (sequelize, Sequelize) => {
    const Setting = sequelize.define("setting", {
        setting_name: { type: Sequelize.STRING },
        setting_value: { type: Sequelize.STRING }
    });

    return Setting;
};