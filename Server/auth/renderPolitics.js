const db = require('../database');
const util = require('util');

const query = util.promisify(db.query).bind(db);

exports.Politics = async (req, res) => {
  try {
    const { city, province, role } = req.body;

    console.log("Received req.body:", req.body);
    console.log("Province:", province);
    console.log("City:", city);

    const result = await query('SELECT * FROM politician WHERE province = ? AND city = ? AND role = ?', [province, city, role]);
    res.json(result); // Send data to frontend
  } catch (error) {
    console.error("Database Query Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
