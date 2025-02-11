const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// Serve static files (CSS)
app.use(express.static(path.join(__dirname, 'public')));

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
  res.send(`<h2>Hello, ${name}!</h2>`);
});
