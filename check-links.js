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
