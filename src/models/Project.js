'use strict';

import { Schema, model } from 'mongoose';

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required!'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required!'],
      trim: true,
    },
    deliveryDate: {
      type: Date,
      default: Date.now(),
    },
    client: {
      type: String,
      required: [true, 'Client is required!'],
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model('Project', ProjectSchema);
