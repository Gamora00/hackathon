const db = require('../database');
const util = require('util');

const query = util.promisify(db.query).bind(db);

exports.getNews = async (req, res) => {
    try {
        const {id} = req.params
        const news = await query('SELECT * FROM newflash WHERE id = ? ', [id]);
        res.json(news); 
       
        
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ error: "Failed to fetch news" });
    }
};
