'use strict';

import { Schema, model } from 'mongoose';

const TaskSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Task name is required!'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Task description is required!'],
      trim: true,
    },
    state: {
      type: Boolean,
      default: false,
    },
    deliveryDate: {
      type: Date,
      required: [true, 'Delivery date is required!'],
      default: Date.now(),
    },
    priority: {
      type: String,
      required: [true, 'Priority is required!'],
      enum: ['Baja', 'Media', 'Alta'],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    completedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

export default model('Task', TaskSchema);
