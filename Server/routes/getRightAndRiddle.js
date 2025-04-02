const db = require('../database');
const util = require('util');

const query = util.promisify(db.query).bind(db);

exports.rightAndRiddle = async (req, res) => {
    try {
        // 1️⃣ Get a random correct answer
        const correctAnswerQuery = await query(`SELECT * FROM game ORDER BY RAND() LIMIT 1`);
        if (correctAnswerQuery.length === 0) {
            return res.status(404).json({ error: "No questions found in the database" });
        }
        const correctAnswer = correctAnswerQuery[0]; // Store correct answer
        const correctAnswerID = correctAnswer.id;

        // 2️⃣ Get the maximum ID from the "game" table
        const result = await query(`SELECT MAX(id) AS maxID FROM game`);
        const maxID = result[0].maxID;

        if (maxID < 4) {
            console.log("Not enough questions in the database!");
            return res.status(400).json({ error: "Not enough questions in the database" });
        }

        // 3️⃣ Generate 3 unique random wrong choices (excluding correct answer)
        const multipleChoice = new Set();
        while (multipleChoice.size < 3) {
            const randomID = Math.floor(Math.random() * maxID) + 1;
            if (randomID !== correctAnswerID) {
                multipleChoice.add(randomID);
            }
        }

        console.log("Generated wrong choices:", Array.from(multipleChoice));

        // 4️⃣ Fetch wrong choices from the database
        const wrongChoices = await query(`SELECT * FROM game WHERE id IN (?)`, [Array.from(multipleChoice)]);

        // 5️⃣ Combine correct and wrong answers in one array
        const finalChoices = [...wrongChoices, correctAnswer];

        // 6️⃣ Shuffle the choices for randomness
        finalChoices.sort(() => Math.random() - 0.5);

        console.log(finalChoices);
        console.log(correctAnswerID);
        
        res.json(finalChoices);
    } catch (error) {
        console.error("Error fetching choices:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
