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
      msg: 'Proyecto creado correctamente!',
      project: newProject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Algo salió mal!' });
  }
};

export const getProjects = async (req, res) => {
  const { authenticatedUser } = req;
  const ownProjects = { owner: authenticatedUser._id };

  try {
    const [projects, total] = await Promise.all([
      Project.find({
        $or: [
          { collaborators: { $in: authenticatedUser._id } },
          { owner: { $in: authenticatedUser._id } },
        ],
      }).select('-tasks'),
      Project.countDocuments(ownProjects),
    ]);

    res.status(200).json({ total, projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Algo salió mal!' });
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

  res.status(200).json({ project });
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
      .json({ msg: 'Proyecto actualizado satisfactoriamente!', project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Algo salió mal!' });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await Project.findByIdAndDelete(id);

    res.status(200).json({ msg: 'Proyecto eliminado satisfactoriamente!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Algo salió mal!' });
  }
};

// Collaborators
export const addCollaborator = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const project = await Project.findById(id);
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado!' });

    // Owner can't be a collaborator in your project  <- Do it also in Front
    if (project.owner._id.toString() === user._id.toString())
      return res.status(401).json({
        msg: 'El creador del proyecto no puede ser colaborador!',
        ok: false,
      });

    // Not yet a collaborator
    if (project.collaborators.includes(user._id))
      return res
        .status(401)
        .json({ msg: 'El usuario ya es colaborador en este proyecto!' });

    project.collaborators.push(user._id);
    await project.save();

    res.status(200).json({ msg: 'Colaborador agregado satisfactoriamente!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Algo salió mal!' });
  }
};

export const removeCollaborator = async (req, res) => {
  const { id } = req.params;
  const { partnerId } = req.body;

  const project = await Project.findById(id);

  // Delete collaborator - pull of Mongoose
  project.collaborators.pull(partnerId);
  await project.save();

  res.status(200).json({ msg: 'Colaborador removido correctamente!' });
};
