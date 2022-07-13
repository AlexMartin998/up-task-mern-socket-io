'use strict';

import jwt from 'jsonwebtoken';

import { SECRETORKEY_JWT } from './../config';
import { User } from './../models';

export const protectWithJwt = async (req, res, next) => {
  const bearerToken = req.header('Authorization');
  if (!bearerToken || !bearerToken.startsWith('Bearer'))
    return res.status(401).json({ ok: false, msg: 'Invalid token!' });

  const tokenJwt = bearerToken.split(' ')[1];

  try {
    const { id } = jwt.verify(tokenJwt, SECRETORKEY_JWT);
    const user = await User.findById(id).select(
      '-password -token -confirmed -createdAt -updatedAt'
    );

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
