const bcrypt = require('bcryptjs');
const { Client } = require('pg');

async function updateAdminPassword() {
  const hash = bcrypt.hashSync('Admin123', 10);
  console.log('Generated hash:', hash);
  
  const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    database: 'agx',
    user: 'agx',
    password: 'AGX2025Pass',
  });
  
  await client.connect();
  
  const result = await client.query(
    'UPDATE agx_admin SET password_hash = $1 WHERE username = $2',
    [hash, 'admin']
  );
  
  console.log('Updated rows:', result.rowCount);
  await client.end();
  console.log('Done!');
}

updateAdminPassword().catch(console.error);
