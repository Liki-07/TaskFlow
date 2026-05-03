const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const { isAuthenticated } = require('../middleware/auth');



router.get('/', (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect('/dashboard');
    }
    res.redirect('/auth/login');
});


router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user._id;

        // Step 1: Find projects user is part of
        const projects = await Project.find({
            $or: [
                { createdBy: userId },
                { members: userId }
            ]
        });

        const projectIds = projects.map(p => p._id);

        // Step 2: Get tasks from those projects
        const tasks = await Task.find({
            project: { $in: projectIds }
        });

        // Step 3: Stats
        const stats = {
            totalTasks: tasks.length,
            todo: tasks.filter(t => t.status === 'To Do').length,
            inProgress: tasks.filter(t => t.status === 'In Progress').length,
            done: tasks.filter(t => t.status === 'Done').length,
            overdue: tasks.filter(
                t => new Date(t.dueDate) < new Date() && t.status !== 'Done'
            ).length
        };

       

        // Step 4: Get tasks assigned to current user
        const userTasks = await Task.find({
            project: { $in: projectIds },
            assignedTo: userId,
            status: { $ne: 'Done' } 
        }).populate('project');
 
        res.render('dashboard', { stats, userTasks, user: req.session.user });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
module.exports = router;
