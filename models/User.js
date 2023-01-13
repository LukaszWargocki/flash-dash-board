// A user schema with password hashed with bcrypt and method to check password
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  email: { type: String, unique: true},
  password: String,
})

// middleware for hashing passwords with bcrypt
UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// password validator method
UserSchema.methods.comparePassword = function comparePassword(potentialPassword, cb){
  bcrypt.compare(potentialPassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);