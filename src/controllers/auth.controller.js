'use strict';

import { genId } from '../helpers';
import { User } from './../models';

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({ name, email, password, token: genId() });
    await newUser.save();

    res.status(201).json({
      ok: true,
      msg: 'User successfully created, check your email.',
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    console.log({ error: error.message });
    res.status(500).json({ ok: false, msg: 'Something went wrong!' });
  }
};
