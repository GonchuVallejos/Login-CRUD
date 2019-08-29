const bcrypt = require('bcryptjs');
const helpers = {}

helpers.encryptPassword = async (Password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(Password, salt);
    return hash;
};

helpers.matchPassword = async (Password, savedPassword) => {
    try{
        return await bcrypt.compare(Password, savedPassword);
    } catch(e) {
        console.log(e);
    }
};

module.exports = helpers;