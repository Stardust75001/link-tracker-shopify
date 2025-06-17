const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (_, res) => res.send('Link tracker is active.'));
app.listen(port, () => {
  console.log(`🟢 Link tracker running on port ${port}`);
});
