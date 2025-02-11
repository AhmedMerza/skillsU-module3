const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Create and connect to sqlite database
const db = new sqlite3.Database('todo.db', (err) => {
  if (err) {
    console.error('Could not connect to db:', (err.message));
    return;
  }  

  console.log('Connected to the todo database.');
});

// Create the tasks table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT,
    completed BOOLEAN DEFAULT 0
  )`);

// Show the Todo list
app.get('/', (req, res) => {
  db.all('SELECT * FROM tasks', (err, tasks) => {
    if (err) {
      console.error('Could not get tasks:', err.message);
      return;
    }

      // Create a list of tasks
      let taskList = tasks.map(task => `
        <li id="task-${task.id}" class="${task.completed ? 'completed' : ''}">
          <span>${task.task}</span>
          <div class="task-actions">
            ${!task.completed ? `<a href="#" class="complete-task" data-id="${task.id}">✅</a>` : ''}
          <a href="#" class="delete-task" data-id="${task.id}">❌</a>   
        </div>
      </li>
    `).join('');

     res.send(`
      <html>
        <head>
          <link rel="stylesheet" href="/style.css" />
        </head>
        <body>
          <h1>📝 My To-Do List</h1>
          <form action="/add" method="POST">
            <input type="text" name="task" placeholder="New task" required />
            <button type="submit">Add Task</button>
          </form>
          <ul>${taskList}</ul>
          <script src="/script.js"></script>
        </body>
      </html>
    `);
  });
});

// Add a new task
app.post('/add', (req, res) => {
  const task = req.body.task;
  db.run('INSERT INTO tasks (task, completed) VALUES (?, 0)', task, (err) => {
    if (err) {
      console.error('Could not insert task:', err.message);
    }
    res.redirect('/');
  });
});

// Mark a task as completed
app.post('/complete/:id', (req, res) => {
  const taskId = req.params.id;
  db.run('UPDATE tasks SET completed = 1 WHERE id = ?', taskId, function(err) {
    if (err) {
      console.error('Could not mark task as completed:', err.message);
      return res.status(500).json({ success: false, message: "Error completing task." });
    }
    res.json({ success: true, taskId: taskId });
  });
});

// Delete a task
app.post('/delete/:id', (req, res) => {
  const taskId = req.params.id;
  db.run('DELETE FROM tasks WHERE id = ?', taskId, (err) => {
    if (err) {
      console.error('Could not delete task:', err.message);
      return res.status(500).json({ success: false, message: "Error deleting task." });
    }

   res.json({ success: true, id: taskId });  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
