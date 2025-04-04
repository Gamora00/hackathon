const db = require('../database');
const util = require('util');

const query = util.promisify(db.query).bind(db);

exports.stats = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL param
    const { correct, entry } = req.body; // Get stats from frontend

    if (!id || correct === undefined || entry === undefined) {
      return res.status(400).json({ error: 'Missing id, correct, or entry' });
    }

    const sql = `
      INSERT INTO lesson (id, correct, entries)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        correct = correct + VALUES(correct),
        entries = entries + VALUES(entries)
    `;

    await query(sql, [id, correct, entry]);

    res.status(200).json({ message: 'Stats updated successfully' });
  } catch (error) {
    console.error('Error updating stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
