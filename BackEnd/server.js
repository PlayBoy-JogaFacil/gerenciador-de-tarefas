const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const FILE_PATH = '/tasks.json';

function readTasks() {
    if (!fs.existsSync(FILE_PATH)) {
        fs.writeFileSync(FILE_PATH, "[]");
    }
    return JSON.parse(fs.readFileSync(FILE_PATH));
}

function writeTasks(tasks) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));

}

app.get("/tasks", (req, res) => {
    res.json(readTasks());

});

app.get("/tasks/:id", (req, res) => {
    const tasks = readTasks();
    const task = tasks.find(t => t.id == req.params.id);

    task ? res.json(task) : res.status(404).json({ message: "Task not found" });

});

app.post("/tasks", (req, res) => {
    const tasks = readTasks();
    const newTask = {
        id: Date.now(),
        title: req.body.title,
        descripition: req.body.description || "",
        completed: false,
    };

    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
    const tasks = readTasks();

    const taskIndex = tasks.findIndex(t => t.id == req.params.id);

    if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found" });
    }

    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    writeTasks(tasks);
    res.json(tasks[taskIndex]);

    const task = tasks.find(t => t.id == req.params.id);
    if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found" });
    }
    task[taskIndex] = { ...task[taskIndex], ...req.body };
    writeTasks(tasks);
    res.json(task[taskIndex]);
});

app.delete("/tasks/:id", (req, res) => {
    let tasks = readTasks();
    tasks = tasks.filter(t => t.id != req.params.id);
    writeTasks(tasks);
    res.status(204).send();
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});