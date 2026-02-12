const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const seedDatabase = async () => {
  try {
    console.log('🔌 Conectando a la base de datos...');
    
    await pool.query(`
      CREATE TYPE event_category AS ENUM ('ACADEMICO', 'ADMINISTRATIVO', 'EXAMEN', 'FERIADO');
      CREATE TABLE IF NOT EXISTS academic_events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category event_category NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL
      );
    `);

    const jsonPath = path.join(__dirname, '../data-parser/output.json');
    const events = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log(`🌱 Insertando ${events.length} eventos...`);
    
    for (const event of events) {
      await pool.query(
        'INSERT INTO academic_events (title, category, start_date, end_date) VALUES ($1, $2, $3, $4)',
        [event.title, event.category, event.start_date, event.end_date]
      );
    }

    console.log('✨ ¡Base de datos hidratada con éxito!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
};

seedDatabase();