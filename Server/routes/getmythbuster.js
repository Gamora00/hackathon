const db = require('../database');
const util = require('util');

const query = util.promisify(db.query).bind(db);
let previouslySelectedQuestions = new Set(); // Use a Set to store unique questions

exports.getMythbuster = async (req, res) => {
  
    try {
        const result = await query('SELECT * FROM mythbuster');

        if (result.length > 0) {
            // Filter out previously selected questions
            const availableQuestions = result.filter(q => !previouslySelectedQuestions.has(q.id));

            if (availableQuestions.length > 0) {
                const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
                previouslySelectedQuestions.add(randomQuestion.id); // Add to the Set

                // Reset if all questions have been selected
                if (previouslySelectedQuestions.size >= result.length) {
                    previouslySelectedQuestions.clear(); // Reset after 10 questions
                }

                res.json({ 
                    question: randomQuestion.question, 
                    correct_answer: randomQuestion.answer 
                }); // Send a properly structured response
            } else {
                res.status(404).json({ message: 'All questions have been answered.' });
            }
        } else {
            res.status(404).json({ message: 'No questions found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
};
