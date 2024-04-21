const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema ({

    name: {
        type: String
    },

    email: {
        type: String,
        unique: true
        
    },

    phone: {
        type: String
    
    },

    password: {
        type: String,
        required: true
    }, 

    date: {
        type: Date
    },

    favorites: [
        {
            type: ObjectId,
            ref: 'Book'
        }
    ]
}, {
    collection: 'users'
});


// Create a "pre-hook" that will run prior to a record being saved
// Hash the incoming password 10x and then store the hashed password back to the user object
UserSchema.pre('save', async function(next){
    const user = this;
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
});

// Create a helper function that uses bcrypt to check the plain text version 
// of the password against the hashed version
UserSchema.methods.isValidPassword = async function (encryptedPassword) {
    const user = this;
    const compare = await bcrypt.compare(encryptedPassword, user.password);
    return compare;
};

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;