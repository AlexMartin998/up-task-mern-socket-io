'use strict';

import jwt from 'jsonwebtoken';

import { SECRETORKEY_JWT } from './../config';
import { User } from './../models';

export const protectWithJwt = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token || !token.startsWith('Bearer'))
    return res
      .status(401)
      .json({ ok: false, msg: "You haven't sent a valid token" });

  const tokenWithoutBearer = token.split(' ')[1];

  try {
    const { id } = jwt.verify(tokenWithoutBearer, SECRETORKEY_JWT);
    const user = await User.findById(id).select('-password -token -confirmed');

    if (!user)
      return res
        .status(401)
        .json({ ok: false, msg: 'Invalid token - user does not exist!' });

    req.authenticatedUser = user;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ msg: 'Invalid token!' });
  }
};
