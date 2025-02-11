const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;
const path = require('path');

// Serve static files (CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Create and connect to sqlite database
const db = new sqlite3.Database('todo.db', (err) => {
  if (err) {
    console.error('Could not connect to db:', (err.message));
    return;
  }  

  console.log('Connected to the todo database.');
});

db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT)');

app.get('/', (req, res) => {
  res.send('Hello, welcome to my TODO list app!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/form', (req, res) => {
  res.send(`
    <html>
      <head>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <form action="/greet" method="get">
          <input type="text" name="name" placeholder="Enter your name" />
          <button type="submit">Greet Me</button>
        </form>
      </body>
    </html>
  `);
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
