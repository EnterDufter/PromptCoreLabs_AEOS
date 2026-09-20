const { Client } = require('/app/server/node_modules/pg');

const client = new Client({
  connectionString: 'postgres://paperclip:paperclip@db:5432/paperclip'
});

async function run() {
  await client.connect();
  const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
  console.log('Tables:', tables.rows.map(r => r.table_name));
  
  try {
    const users = await client.query('SELECT id, email, name, role FROM users');
    console.log('Users in users:', users.rows);
  } catch (e) {
    try {
      const users = await client.query('SELECT id, email, name, role FROM "user"');
      console.log('Users in "user":', users.rows);
    } catch (err) {
      console.log('Error querying users:', err.message);
    }
  }
  await client.end();
}

run();
