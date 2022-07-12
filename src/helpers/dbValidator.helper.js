'use strict';

import { User } from '../models';

export const isAlreadyRegistered = async (query, collection, req) => {
  let model;
  // const { email } = req.body;

  const checkInCollection = () => {
    if (model)
      throw new Error(
        `The ${collection}${
          query.includes('@') ? "'s email" : ' name'
        } is already registered!`
      );
  };

  switch (collection) {
    case 'user':
      model = await User.findOne({ email: query });
      return checkInCollection();

    default:
      throw new Error('Something went wrong!');
  }
};
