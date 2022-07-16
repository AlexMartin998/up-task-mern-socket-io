'use strict';

import { User } from './../models';
import { emailRegister, genId, genJWT } from '../helpers';

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({ name, email, password, token: genId() });
    await newUser.save();

    // Send confirmation email
    await emailRegister({ name, email, token: newUser.token });

    res.status(201).json({
      ok: true,
      msg: 'User successfully created, check your email.',
    });
  } catch (error) {
    console.log(error);
    console.log({ error: error.message });
    res.status(500).json({ ok: false, msg: 'Something went wrong!' });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Generate JWT
    const jwt = genJWT(user.id);

    res.status(200).json({
      ok: true,
      msg: 'Successful login!',
      token: jwt,
      user: {
        uid: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Something went wrong!' });
  }
};
