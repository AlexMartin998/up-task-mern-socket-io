'use strict';

export default io => {
  io.on('connection', socket => {
    console.log('New user connected!');

    socket.on('client:openProject', projectId => {
      socket.join(projectId); // 1 room x c/project
    });

    // Tasks
    socket.on('client:createTask', newTask => {
      const project = newTask.project;

      socket.to(project).emit('server:addedTask', newTask); // Solo a los del mismo project/room
    });

    socket.on('client:deleteTask', deletedTask => {
      const project = deletedTask.project;

      socket.to(project).emit('server:deletedTask', deletedTask);
    });
  });
};
