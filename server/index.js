import express from 'express';
import cors from 'cors';
import pg from 'pg';
import crypto from 'crypto';

const { Pool } = pg;

const app = express();
const PORT = process.env.PORT || 3000;
const PROXY_URL = process.env.PROXY_URL || 'https://arena-tracker-proxy.onrender.com';
const BOT_USERNAME = process.env.BOT_USERNAME || 'example_bot';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: error.message });
  }
});

app.get('/profile', async (req, res) => {
  const { allyCode } = req.query;
  if (!allyCode) {
    return res.status(400).json({ error: 'allyCode required' });
  }

  try {
    const response = await fetch(`${PROXY_URL}/profile?allyCode=${encodeURIComponent(allyCode)}`);
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/start-session', async (req, res) => {
  try {
    const sessionToken = `auth_${crypto.randomBytes(16).toString('hex')}`;
    
    await pool.query(
      'INSERT INTO auth_sessions (session_token, status) VALUES ($1, $2)',
      [sessionToken, 'pending']
    );

    const botUrl = `https://t.me/${BOT_USERNAME}?start=${sessionToken}`;
    res.json({ sessionToken, botUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/check-session', async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: 'token required' });
  }

  try {
    const result = await pool.query(
      `SELECT s.status, s.auth_token, u.ally_code, u.player_name, u.portrait_id, u.guild_name 
       FROM auth_sessions s 
       LEFT JOIN users u ON s.ally_code = u.ally_code 
       WHERE s.session_token = $1 AND s.expires_at > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session expired or not found' });
    }

    const session = result.rows[0];

    if (session.status === 'approved') {
      return res.json({
        status: 'approved',
        authToken: session.auth_token,
        user: {
          allyCode: session.ally_code,
          playerName: session.player_name,
          portraitId: session.portrait_id,
          guildName: session.guild_name
        }
      });
    }

    res.json({ status: 'pending' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const result = await pool.query(
      `UPDATE users 
       SET last_active_at = NOW() 
       WHERE auth_token = $1 
       RETURNING ally_code, player_name, portrait_id, guild_name`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = result.rows[0];
    res.json({
      allyCode: user.ally_code,
      playerName: user.player_name,
      portraitId: user.portrait_id,
      guildName: user.guild_name
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
