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
      // .allSettled()
      Project.find({
        $or: [
          { collaborators: { $in: authenticatedUser._id } },
          { owner: { $in: authenticatedUser._id } },
        ],
      }).select('-tasks'),
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
    .populate('owner', 'email name')
    .populate('collaborators', 'email name')
    .populate({
      path: 'tasks',
      populate: { path: 'completedBy', select: 'name' },
    }); // populate a 1 populate

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

// TODO: Middleware para validar el email

export const lookForCollaborator = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ ok: false, msg: 'Unregistered email!' });

  res.status(200).json({ ok: true, user });
};

export const addCollaborator = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  const project = await Project.findById(id);
  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ ok: false, msg: 'Unregistered email!' });

  // Owner can't be a collaborator in your project  <- Do it also in Front
  if (project.owner._id.toString() === user._id.toString())
    return res.status(401).json({
      msg: 'The Project Creator cannot be a collaborator!',
      ok: false,
    });

  // Not yet a collaborator
  if (project.collaborators.includes(user._id))
    return res
      .status(401)
      .json({ msg: 'The user already belongs to the project' });

  project.collaborators.push(user._id);
  await project.save();

  res.status(200).json({ msg: 'Collaborator successfully added!' });
};

export const removeCollaborator = async (req, res) => {
  const { id } = req.params;
  const { partnerId } = req.body;

  const project = await Project.findById(id);

  // Delete collaborator - pull of Mongoose
  project.collaborators.pull(partnerId);
  await project.save();

  res.status(200).json({ ok: true, msg: 'Collaborator successfully deleted!' });
};
