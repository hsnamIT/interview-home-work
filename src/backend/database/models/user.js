const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { SALT_ROUND } = require('../../config');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  dob: {
    type: String
  },
  created_at: {
    type: Date, default: Date.now
  }
});

UserSchema.pre('save', function (next) {
  let user = this;

  bcrypt.hash(user.password, SALT_ROUND)
    .then(hashedPassword => {
      user.password = hashedPassword;
      next();
    })
    .catch(err => {
      next(err);
      throw new Error(err);
    });
});

UserSchema.method.findUserByUsername = async function (username) {
  return await this.model('User').find({username: username});
};

UserSchema.method.comparePassword = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) reject(err);
      resolve(isMatch);
    })
  })
}

module.exports = mongoose.model("User", UserSchema);
