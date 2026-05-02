const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

exports.index = async (req, res) => {
   try {
    const projects = await Project.find({
        $or: [
            { creator: req.session.user._id },
            { members: req.session.user._id }
        ]
    }).populate('creator');

    res.render('projects/index', { 
        projects, 
        user: req.session.user 
    });

} catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
}
};


exports.getProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user._id;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).send('Project not found');
        }

        // Check if user belongs to this project
        const isMember =
            project.creator.toString() === userId ||
            project.members.includes(userId);

        if (!isMember) {
            return res.status(403).send('Access denied');
        }

        // Check admin (IMPORTANT)
        const isAdmin = project.creator.toString() === userId;

        const tasks = await Task.find({ project: projectId })
            .populate('assignedTo');

        // Group tasks (clean UI)
        const groupedTasks = {
            todo: tasks.filter(t => t.status === 'To Do'),
            inProgress: tasks.filter(t => t.status === 'In Progress'),
            done: tasks.filter(t => t.status === 'Done')
        };

        console.log("isAdmin",isAdmin)

        res.render('projects/show', {
            project,
            groupedTasks,
            user: req.session.user,
            isAdmin
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.newProject = (req, res) => {
    res.render('projects/new', { user: req.session.user });
};

exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const project = new Project({
            name,
            description,
            creator: req.session.user._id,
            members: [req.session.user._id]
        });
        await project.save();
        
        res.redirect('/projects');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.showProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('creator').populate('members');
        if (!project) return res.status(404).send('Not Found');
        
        const tasks = await Task.find({ project: project._id }).populate('assignedTo');
        res.render('projects/show', { project, tasks, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getMembers = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await Project.findById(projectId).populate('members').populate('creator');
        if (!project) return res.status(404).send('Project not found');
        
        const isAdmin = project.creator._id.toString() === req.session.user._id.toString();
        
        // Find users not in the project
        const memberIds = project.members.map(m => m._id);
        memberIds.push(project.creator._id);
        const availableUsers = await User.find({ _id: { $nin: memberIds } });

        res.render('projects/members', { project, availableUsers, user: req.session.user, isAdmin });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.addMember = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { userId } = req.body;
        const project = await Project.findById(projectId);
        
        if (project.creator.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('Access denied');
        }

        if (userId && !project.members.includes(userId)) {
            project.members.push(userId);
            await project.save();
        }
        res.redirect(`/projects/${projectId}/members`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.removeMember = async (req, res) => {
    try {
        const { id: projectId, memberId } = req.params;
        const project = await Project.findById(projectId);

        if (project.creator.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('Access denied');
        }

        project.members = project.members.filter(m => m.toString() !== memberId);
        await project.save();

        res.redirect(`/projects/${projectId}/members`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getMemberTasks = async (req, res) => {
    try {
        const { id: projectId, memberId } = req.params;
        const project = await Project.findById(projectId);
        const member = await User.findById(memberId);

        if (!project || !member) return res.status(404).send('Not Found');

        const tasks = await Task.find({ project: projectId, assignedTo: memberId });

        res.render('projects/memberTasks', { project, member, tasks, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.editProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).send('Not Found');
        
        if (project.creator.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('Access denied');
        }

        res.render('projects/edit', { project, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const project = await Project.findById(req.params.id);

        if (project.creator.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('Access denied');
        }

        project.name = name;
        project.description = description;
        await project.save();

        res.redirect(`/projects/${project._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        
        if (project.creator.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('Access denied');
        }

        await Project.findByIdAndDelete(req.params.id);
        await Task.deleteMany({ project: req.params.id });

        res.redirect('/projects');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
