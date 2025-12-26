const express = require('express');

const app = express();
const PORT = process.env.PORT || 5001;

// TODO: mount routes from ./src/routes once implemented
// const authRoutes = require('./src/routes/auth.routes');
// app.use('/api/admin/auth', authRoutes);

app.get('/api/admin/health', (req, res) => {
  res.json({ status: 'ok', service: 'admin-backend' });
});

app.listen(PORT, () => {
  console.log(`Admin backend listening on port ${PORT}`);
});
