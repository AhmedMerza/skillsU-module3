const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, welcome to my Node.js app!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/form', (req, res) => {
  res.send(`
    <form action="/greet" method="get">
      <input type="text" name="name" placeholder="Enter your name" />
      <button type="submit">Greet Me</button>
    </form>
  `);
});

app.get('/greet', (req, res) => {
  const name = req.query.name || 'stranger';
  res.send(`<h2>Hello, ${name}!</h2>`);
});
