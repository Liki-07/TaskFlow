const Task = require('../models/Task');
const Project = require('../models/Project');

exports.newTask = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate('members');
        res.render('tasks/new', { project, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, assignedTo } = req.body;
        const task = new Task({
            title,
            description,
            dueDate,
            priority,
            assignedTo,
            project: req.params.projectId
        });
        await task.save();
        res.redirect(`/projects/${req.params.projectId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.editTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        res.render('tasks/edit', { task, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const task = await Task.findByIdAndUpdate(req.params.taskId, { title, description, status });
        res.redirect(`/projects/${task.project}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.taskId);
        res.redirect(`/projects/${task.project}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
