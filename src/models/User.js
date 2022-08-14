'use strict';

import { Schema, model } from 'mongoose';
import bcryptjs from 'bcryptjs';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required!'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required!'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
      trim: true,
    },
    token: {
      type: String,
      default: null,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  // If the pass is already hashed, it don't re-hashet it
  if (!this.isModified('password')) return next();

  const hash = await bcryptjs.hash(this.password, 10);
  this.password = hash;

  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  user.uid = user._id;

  delete user.password;
  delete user._id;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.token;
  delete user.confirmed;

  return user;
};

export default model('User', UserSchema);
