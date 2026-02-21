const express = require('express');
import type { Request, Response } from 'express';
const app = express();

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send('API is running');
});

app.get('/api/hello', (_req: Request, res: Response) => {
  res.json({ message: 'Hello world' });
});

const PORT = process.env['PORT'] ?? 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});