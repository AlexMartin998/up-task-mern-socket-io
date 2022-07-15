'use strict';

import { Project, Task, User } from '../models';

export const isAlreadyRegistered = async (query, collection) => {
  let model;

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

const isSameUer = (model, authenticatedUser) => {
  if (model.owner._id.toString() !== authenticatedUser._id.toString())
    throw new Error('Unauthorized!');
};

export const idExistInDB = async (id, collection, req) => {
  let model;
  const { authenticatedUser } = req;

  const checkInCollection = () => {
    if (!model)
      throw new Error(`${collection} ID: '${id} doesn't exist in DB!`);
  };

  switch (collection) {
    case 'project':
      model = await Project.findById(id);
      checkInCollection();
      return isSameUer(model, authenticatedUser);

    case 'task':
      model = await Task.findById(id).populate('project');
      checkInCollection();

      if (
        model.project.owner._id.toString() !== authenticatedUser._id.toString()
      )
        throw new Error('Unauthorized!');

      return;

    default:
      throw new Error('Something went wrong!');
  }
};

export const isValidPriority = priority => {
  if (!['baja', 'media', 'alta'].includes(priority.toLowerCase()))
    throw new Error(`Invalid priority! - ${priority}`);

  return true;
};
