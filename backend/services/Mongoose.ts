const mongoose = require('mongoose')
require('../models/users')
require('../models/game')
require('../models/sockets')

class Mongoose {
    public static async InitializeConnection() {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
    }
}

export { Mongoose };
export default new Mongoose();
