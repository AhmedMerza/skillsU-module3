const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');

// Serve static files (CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Create and connect to sqlite database
const db = new sqlite3.Database('todo.db', (err) => {
  if (err) {
    console.error('Could not connect to db:', (err.message));
    return;
  }  

  console.log('Connected to the todo database.');
});

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

       let taskList = tasks.map(task => `
      <li>
        ${task.completed ? `<s>${task.task}</s>` : task.task} 
        <a href="/complete/${task.id}">✅</a> 
        <a href="/delete/${task.id}">❌</a>
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
            <button type="submit">➕ Add Task</button>
          </form>
          <ul>${taskList}</ul>
        </body>
      </html>
    `);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Add a new task
app.post('/add', (req, res) => {
  const task = req.body.task;
  db.run('INSERT INTO tasks (task) VALUES (?)', task, (err) => {
    if (err) {
      console.error('Could not insert task:', err.message);
    }
    res.redirect('/');
  });
});

// Mark a task as completed
app.get('/complete/:id', (req, res) => {
  const taskId = req.params.id;
  db.run('UPDATE tasks SET completed = 1 WHERE id = ?', taskId, (err) => {
    if (err) {
      console.error('Could not mark task as completed:', err.message);
    }
    res.redirect('/');
  });
});

// Delete a task
app.get('/delete/:id', (req, res) => {
  const taskId = req.params.id;
  db.run('DELETE FROM tasks WHERE id = ?', taskId, (err) => {
    if (err) {
      console.error('Could not delete task:', err.message);
    }
    res.redirect('/');
  });
});

app.get('/greet', (req, res) => {
  const name = req.query.name || 'stranger';

  db.run('INSERT INTO tasks (task) VALUES (?)', name, (err) => {
    if (err) {
      console.error('Could not insert task:', err.message);
      return;
    }

    console.log('Task inserted successfully');
  });

  res.send(`<h2>Hello, ${name}!</h2>`);
});
