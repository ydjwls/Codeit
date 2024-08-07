import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxLength: 30,
        },
        description: {
            type: String,
        },
        isComplete: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

const Task = moongoose.model('Task', TaskSchema);  // tasks 

export default Task;