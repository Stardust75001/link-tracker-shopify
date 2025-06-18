const fetch = require('node-fetch');
const fs = require('fs');
const nodemailer = require('nodemailer');

const links = [
  'https://thepetsociety.paris/',
  'https://thepetsociety.paris/collections/spa',
  'https://thepetsociety.paris/pages/404-error'
];

(async () => {
  const broken = [];

  for (const url of links) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (!res.ok) broken.push({ url, status: res.status });
    } catch (e) {
      broken.push({ url, status: 'fetch error' });
    }
  }

  const date = new Date();
  const dateString = date.toISOString().split('T')[0];
  const localeDate = date.toLocaleDateString();
  const filename = `broken-links-${dateString}.json`;

  const report = {
    generatedAt: date,
    brokenLinks: broken
  };

  fs.writeFileSync(filename, JSON.stringify(report, null, 2));
  console.log(`✅ Rapport généré (${broken.length} lien(s) cassé(s))`);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: { ciphers: 'SSLv3' }
  });

  transporter.sendMail({
    from: `"Shopify Link Checker" <${process.env.SMTP_USER}>`,
    to: process.env.MAIL_TO,
    subject: `[Shopify] Rapport de liens cassés – ${localeDate}`,
    text: `Le rapport contient ${broken.length} lien(s) cassé(s).`,
    attachments: [
      {
        filename,
        path: `./${filename}`,
        contentType: 'application/json'
      }
    ]
  }, (error, info) => {
    if (error) {
      return console.error('❌ Erreur d’envoi mail :', error);
    }
    console.log('📨 Rapport envoyé ✔ :', info.response);
  });
})();
