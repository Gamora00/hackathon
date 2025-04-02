const db = require('../database');
const util = require('util');

const query = util.promisify(db.query).bind(db);

exports.profile = async (req, res) => {
    try {
        const { id } = req.params;
        
        const profileQuery = `
            SELECT p.*, GROUP_CONCAT(a.advocacy) AS advocacy 
            FROM politician p
            LEFT JOIN advocacy a ON p.id = a.politician_Id
            WHERE p.id = ?
            GROUP BY p.id;
        `;

        const data = await query(profileQuery, [id]);

        if (data.length > 0) {
            data[0].advocacy = data[0].advocacy ? data[0].advocacy.split(",") : [];
            res.json(data[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
