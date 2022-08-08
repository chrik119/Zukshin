import mongoose from 'mongoose';

const TaskSchema = mongoose.Schema({
  task: String,
  args: [String],
});

let Task;

try {
  Task = mongoose.model('tasks');
} catch (err) {
  Task = mongoose.model('tasks', TaskSchema);
}

export default Task;
