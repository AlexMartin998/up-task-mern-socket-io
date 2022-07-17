'use strict';

import { User } from './../models';
import { emailResetPassword, genId } from '../helpers';

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

export const generateRecoveryToken = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({ ok: false, msg: "User doesn't exist!" });

  user.token = genId();
  await user.save();

  // Send email with token/instructions
  await emailResetPassword({ email, name: user.name, token: user.token });

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

export const isAuthenticated = (req, res) => {
  const { authenticatedUser } = req;
  res.status(200).json({ ok: true, user: authenticatedUser });
};
