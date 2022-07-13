'use strict';

import { genId, genJWT } from '../helpers';
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

export const confirmUser = async (req, res) => {
  try {
    const { token } = req.params;
    const unconfirmedUser = await User.findOne({ token });

    unconfirmedUser.token = null;
    unconfirmedUser.confirmed = true;
    await unconfirmedUser.save();

    res.status(200).json({
      ok: true,
      msg: 'Successful confirmation!',
    });
  } catch (error) {
    console.log(error);
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

export const generateRecoveryToken = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({ ok: false, msg: "User doesn't exist!" });

  user.token = genId();
  await user.save();

  // Send email with token/instructions

  res
    .status(200)
    .json({ ok: true, msg: 'An e-mail with instructions has been sent.' });
};

export const validateToken = async (_req, res) =>
  res.status(200).json({ ok: true, msg: 'Successful validation!' });

export const genNewPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({ token });
    user.token = null;
    user.password = password;
    await user.save();

    res.status(201).json({ ok: true, msg: 'Password updated successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Something went wrong!' });
  }
};
