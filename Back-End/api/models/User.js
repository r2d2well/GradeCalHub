const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  calculators: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      grades: [
        {
          name: { type: String },
          percent: { type: Number },
        },
      ],
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
