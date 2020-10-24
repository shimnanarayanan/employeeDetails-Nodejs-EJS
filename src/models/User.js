const mongoose = require("mongoose");

const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
   
    firstname: { type:String, required: true },
    lastname: { type: String},
    email: { type: String, required: true }, 
    password:{type:String},
    designation:{ type: String },
    role:{ type: String, default: "admin" }
}, { timestamps: true });



UserSchema.pre('save', function (next) {
    const users = this;
    if (!users.isModified('password')) return next();
    bcrypt.hash(users.password, 10, (err, hash) => {
        if (err) return next(err);
        users.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, res) => {
        if (err) {
            return cb(null, err);
        }
        cb(null, res);
    });
};


const User = mongoose.model("Users", UserSchema);

module.exports = User;
