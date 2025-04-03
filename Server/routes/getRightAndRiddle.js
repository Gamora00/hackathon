const db = require('../database');
const util = require('util');

const query = util.promisify(db.query).bind(db);

let previousQuestions = []; // Store previously selected questions
let lastQuestion = null; // Track the last question to prevent consecutive duplicates

exports.rightAndRiddle = async (req, res) => {
    const multipleChoice = new Set();
    let correctQuestion = null;

    try {
        // Get the maximum ID from the "game" table
        const result = await query(`SELECT MAX(id) AS maxID FROM game`);
        const maxID = result[0].maxID;

        if (maxID < 4) {
            return res.status(400).json({ error: "Not enough questions in the database" });
        }

        // If there are not enough questions left, reset the set
        if (previousQuestions.length >= maxID) {
            previousQuestions = []; // Reset the previous questions if all have been shown
        }

        // Generate random IDs for 3 incorrect choices
        while (multipleChoice.size < 3) {
            const randomID = Math.floor(Math.random() * maxID) + 1;
            multipleChoice.add(randomID);
        }

        // Fetch the correct question (ensure it's not already in the previousQuestions set)
        while (!correctQuestion) {
            const randomID = Math.floor(Math.random() * maxID) + 1;
            const correctQuestionResult = await query(`SELECT * FROM game WHERE id = ?`, [randomID]);
            
            // Ensure it's not the same as the last question
            if (!previousQuestions.includes(correctQuestionResult[0].id) && correctQuestionResult[0].id !== lastQuestion) {
                correctQuestion = correctQuestionResult[0]; // Set the correct question
                previousQuestions.push(correctQuestion.id); // Add it to the previous questions list
                lastQuestion = correctQuestion.id; // Update the last question
            }
        }

        // Add the correct answer's ID to the set of choices
        multipleChoice.add(correctQuestion.id);

        // Fetch the corresponding question choices (ensure we get exactly 4 choices)
        const choices = await query(`SELECT * FROM game WHERE id IN (?)`, [Array.from(multipleChoice)]);

        // Ensure we get exactly 4 choices
        if (choices.length !== 4) {
            return res.status(500).json({ error: "Incorrect number of choices returned" });
        }

        // Structure the response properly
        const response = {
            question: correctQuestion.question,
            choices: choices.map(q => q.answer), // Map to answers only
            correctAnswer: correctQuestion.answer // The correct answer
        };

        console.log("Backend Response:", response); // Log the response for debugging
        res.json(response);

    } catch (error) {
        console.error("Error fetching choices:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
