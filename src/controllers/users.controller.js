'use strict';

import { User } from './../models/index.js';
import { emailResetPassword, genId } from '../helpers/index.js';

export const confirmUser = async (req, res) => {
  const { token } = req.params;

  try {
    await User.findOneAndUpdate({ token }, { token: null, confirmed: true });

    res.status(200).json({
      msg: 'Successful confirmation!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Algo salió mal!' });
  }
};

export const genRecoveryToken = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.confirmed)
    return res.status(401).json({ msg: 'Usuario no registrado!' });

  try {
    user.token = genId();
    await user.save();

    // Send email with token/instructions
    await emailResetPassword({ email, name: user.name, token: user.token });

    res
      .status(200)
      .json({ msg: 'Se le ha enviado un email con instrucciones.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Algo salió mal!' });
  }
};

export const validateToken = async (_req, res) =>
  res.status(200).json({ msg: 'Successful validation!' });

export const genNewPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({ token });
    user.token = null;
    user.password = password;
    await user.save();

    res.status(201).json({ msg: 'Password actualizada correctamente!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Algo salió mal!' });
  }
};

export const isAuthenticated = (req, res) => {
  const { authenticatedUser } = req;
  if (!authenticatedUser) return res.status(401).json({ msg: 'Unauthorized!' });

  res.status(200).json({ user: authenticatedUser });
};

export const getUserByEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  res.status(200).json({ user });
};
