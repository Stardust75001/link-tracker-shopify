import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.post('/api/send-broken-links', async (req, res) => {
  const { data = [], subject, to } = req.body;
  if (!Array.isArray(data) || !to) return res.status(400).send('Bad Request');

  const report = data.map(entry => 
    `URL: ${entry.url}\nText: ${entry.text}\nPage: ${entry.page}\nTime: ${entry.timestamp}`
  ).join('\n\n');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"Shopify Bot" <${process.env.MAIL_USER}>`,
      to,
      subject: subject || '🛠 Shopify – Broken Links Report',
      text: report || 'No broken links reported.'
    });
    res.status(200).send('📨 Mail sent');
  } catch (err) {
    console.error('❌ Mail error:', err);
    res.status(500).send('Server Error');
  }
});

app.listen(process.env.PORT || 3000, () => console.log('🚀 API ready'));
