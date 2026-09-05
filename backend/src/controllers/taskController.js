import Task from "../models/Task.js";


const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Create Task
const createTask = async (req, res, next) => {
    try {
        const { title, description, priority, dueDate } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description: description?.trim() || "",
            priority: priority || "medium",
            dueDate: dueDate || null,
            user: req.userId,
        });

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task,
        });
    } catch (error) {
        next(error);
    }
}

//Get Tasks

const getTasks = async (req, res, next) => {
    try {
        const { search, status, page = 1, limit = 10, } = req.query;

        const filter = {
            user: req.userId,
        };

        if (search && search.trim()) {
            filter.title = {
                $regex: escapeRegex(search.trim()),
                $options: "i",
            };
        }

        if (status !== undefined) {
            if (!["pending", "completed"].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status. Use pending or completed",
                });
            }

            filter.status = status;
        }

        // Validate pagination
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        if (!Number.isInteger(pageNumber) || pageNumber < 1) {
            return res.status(400).json({
                success: false,
                message: "Page must be a positive integer",
            });
        }

        if (
            !Number.isInteger(limitNumber) ||
            limitNumber < 1 ||
            limitNumber > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Limit must be between 1 and 100",
            });
        }

        const skip = (pageNumber - 1) * limitNumber;

        const total = await Task.countDocuments(filter);

        const totalPages = Math.ceil(total / limitNumber);

        // Prevent requesting a page that does not exist
        if (pageNumber > totalPages && totalPages > 0) {
            return res.status(400).json({
                success: false,
                message: "Page number exceeds total pages",
            });
        }

        const tasks = await Task.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        // Get overall task statistics
        const [totalTasks, completedTasks, pendingTasks] = await Promise.all([
            Task.countDocuments({ user: req.userId }),
            Task.countDocuments({
                user: req.userId,
                status: "completed",
            }),
            Task.countDocuments({
                user: req.userId,
                status: "pending",
            }),
        ]);

        return res.status(200).json({
            success: true,
            tasks,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages,
            },
            stats: {
                total: totalTasks,
                completed: completedTasks,
                pending: pendingTasks,
            },
        });
    } catch (error) {
        next(error);
    }
};

//Get Single Task

const getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.userId,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            task,
        });
    } catch (error) {
        next(error);
    }
}

//Update Task

const updateTask = async (req, res, next) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        const updates = {};
        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Title cannot be empty",
                });
            }
            updates.title = title.trim();
        }

        if (description !== undefined) {
            updates.description = description.trim();
        }

        if (status !== undefined) {
            updates.status = status;
        }

        if (priority !== undefined) {
            updates.priority = priority;
        }

        if (dueDate !== undefined) {
            updates.dueDate = dueDate || null;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one field is required to update",
            });
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.userId,
            },
            updates,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task,
        });

    } catch (error) {
        next(error);
    }
}

//Delete Task

const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.userId,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export { createTask, getTasks, getTaskById, updateTask, deleteTask };