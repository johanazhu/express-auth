const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/express-auth', {
    useCreateIndex: true,
    useNewUrlParser: true
})

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: {
        type: String,
        set(val) {
            return bcrypt.hashSync(val, 10)
        }
    }
})


const User = mongoose.model('User', UserSchema)

// User.db.dropCollection('users')

module.exports = { User }