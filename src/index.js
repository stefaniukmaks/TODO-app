const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.query(`
  CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    done BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
  )
`);

// Отримати всі задачі
app.get('/api/todos', async (req, res) => {
  const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
  res.json(result.rows);
});

// Додати задачу
app.post('/api/todos', async (req, res) => {
  const { title } = req.body;
  const result = await pool.query(
    'INSERT INTO todos (title) VALUES ($1) RETURNING *',
    [title]
  );
  res.json(result.rows[0]);
});

// Відмітити виконаною
app.patch('/api/todos/:id', async (req, res) => {
  const result = await pool.query(
    'UPDATE todos SET done = NOT done WHERE id = $1 RETURNING *',
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// Видалити задачу
app.delete('/api/todos/:id', async (req, res) => {
  await pool.query('DELETE FROM todos WHERE id = $1', [req.params.id]);
  res.json({ message: 'Видалено' });
});

app.listen(process.env.PORT, () => {
  console.log(`Сервер на порту ${process.env.PORT}`);
});
