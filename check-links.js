const fetch = require('node-fetch');
const fs = require('fs');

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
      if (!res.ok) {
        broken.push({ url, status: res.status });
      }
    } catch (e) {
      broken.push({ url, status: 'fetch error' });
    }
  }

  const date = new Date().toISOString();
  const report = {
    generatedAt: date,
    brokenLinks: broken
  };

  fs.writeFileSync('broken-links-report.json', JSON.stringify(report, null, 2));
  console.log(`📝 Rapport généré (${broken.length} lien(s) cassé(s))`);
})();
const nodemailer = require('nodemailer');

// Configuration SMTP à partir des variables d’environnement GitHub
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { ciphers: 'SSLv3' }
});

const mailOptions = {
  from: `"Shopify Link Checker" <${process.env.SMTP_USER}>`,
  to: process.env.MAIL_TO,
  subject: `[Shopify] Rapport de liens cassés – ${new Date().toLocaleDateString()}`,
  text: JSON.stringify(report, null, 2),
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error('❌ Erreur d’envoi mail :', error);
  }
  console.log('📧 Rapport envoyé :', info.response);
});
