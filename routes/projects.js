const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/', projectController.index);
router.get('/new', projectController.newProject);
router.post('/', projectController.createProject);
router.get('/:id', projectController.getProject);
router.get('/:id/edit', projectController.editProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Nested routes for members
router.get('/:id/members', projectController.getMembers);
router.post('/:id/members', projectController.addMember);
router.delete('/:id/members/:memberId', projectController.removeMember);
router.get('/:id/members/:memberId/tasks', projectController.getMemberTasks);

// Nested routes for tasks
router.get('/:projectId/tasks/new', taskController.newTask);
router.post('/:projectId/tasks', taskController.createTask);

module.exports = router;
