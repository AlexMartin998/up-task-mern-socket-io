'use strict';

import { Project, User } from '../models';

export const createProject = async (req, res) => {
  const { name, description, client, deliveryDate } = req.body;
  const { authenticatedUser } = req;

  const newProject = new Project({ name, description, client, deliveryDate });
  newProject.owner = authenticatedUser._id;

  try {
    await newProject.save();

    res.status(201).json({
      ok: true,
      msg: 'Project successfully created!',
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
      Project.find(ownProjects).select('-tasks'),
      Project.countDocuments(ownProjects),
    ]);

    res.status(200).json({ ok: true, total, projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Something went wrong!' });
  }
};

export const getProject = async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id)
    .populate('owner', 'name')
    .populate('tasks');

  res.status(200).json({
    ok: true,
    project,
  });
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, client, description, deliveryDate } = req.body;

  try {
    const project = await Project.findByIdAndUpdate(
      id,
      { name, client, description, deliveryDate },
      { new: true }
    );

    res
      .status(200)
      .json({ ok: true, msg: 'Project succssesfully updated!', project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Something went wrong!' });
  }
};

/* Other way: doesn't allow sending empty data
export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, client, description, deliveryDate } = req.body;

  try {
    const project = await Project.findById(id);
    project.name = name || project.name;
    project.description = description || project.description;
    project.client = client || project.client;
    project.deliveryDate = deliveryDate || project.deliveryDate;

    await project.save();

    res
      .status(200)
      .json({ ok: true, msg: 'Project updated succssesfully!', project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Something went wrong!' });
  }
};
 */

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await Project.findByIdAndDelete(id);

    res.status(200).json({ ok: true, msg: 'Project successfully deleted!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Something went wrong!' });
  }
};

export const lookForCollaborator = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select('-confirmed -token');
  if (!user)
    return res.status(404).json({ ok: false, msg: 'Unregistered email!' });

  res.status(200).json({ ok: true, user });
};

export const addCollaborator = async (req, res) => {
  //
};

export const removeCollaborator = async (req, res) => {
  //
};

// Pending:
// export const getTask = async (req, res) => {
//   //
// };
