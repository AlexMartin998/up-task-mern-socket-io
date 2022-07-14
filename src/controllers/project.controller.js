'use strict';

import { Project } from '../models';

export const createProject = async (req, res) => {
  const { name, description, client } = req.body;
  const { authenticatedUser } = req;

  const newProject = new Project({ name, description, client });
  newProject.owner = authenticatedUser._id;

  try {
    await newProject.save();

    res.status(201).json({
      ok: true,
      msg: 'Project created successfully!',
      project: newProject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Something went wrong!' });
  }
};

export const getProjects = async (req, res) => {
  const { authenticatedUser } = req;
  const ownProjects = { owner: authenticatedUser._id };

  try {
    const [projects, total] = await Promise.all([
      Project.find(ownProjects),
      Project.countDocuments(ownProjects),
    ]);

    res.status(200).json({ ok: true, total, projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Something went wrong!' });
  }
};

export const getProject = async (req, res) => {
  //
};

export const updateProject = async (req, res) => {
  //
};

export const deleteProject = async (req, res) => {
  //
};

export const addCollaborator = async (req, res) => {
  //
};

export const removeCollaborator = async (req, res) => {
  //
};

// Pending:
export const getTask = async (req, res) => {
  //
};
