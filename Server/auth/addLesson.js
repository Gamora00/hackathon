const db = require("../database");
const util = require("util");
const multer = require("multer");

const query = util.promisify(db.query).bind(db);

exports.addLesson = async (req, res) => {
    
  try {
    const { title, paragraph, question, answer } = req.body;

    const parsedParagraph = JSON.parse(paragraph);

    const lessonQuery = `INSERT INTO lesson (lessonTitle, question, answer) VALUES (?, ?, ?)`;
    const values = [title, question, answer];

    const lessonResult = await query(lessonQuery, values);
    const lessonId = lessonResult.insertId; 

    if (parsedParagraph.length > 0) {
      const paragraphQuery = `INSERT INTO paragraph (paragraph, lesson_id) VALUES ?`;
      const paragraphData = parsedParagraph.map((p) => [p, lessonId]);

      await query(paragraphQuery, [paragraphData]);
    }

    console.log("Successfully inserted lesson and paragraphs");
    res.status(201).json({ message: "Lesson added successfully" });

  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
