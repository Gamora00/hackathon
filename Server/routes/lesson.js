const db = require("../database");
const util = require("util");

const query = util.promisify(db.query).bind(db);

exports.lesson = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure ID is provided
    if (!id) {
      return res.status(400).json({ error: "Lesson ID is required" });
    }

    // Fetch lesson details
    const lessonResult = await query("SELECT * FROM lesson WHERE id = ?", [id]);

    // Check if lesson exists
    if (lessonResult.length === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    // Fetch paragraphs related to this lesson
    const paragraphResult = await query("SELECT * FROM paragraph WHERE lesson_id = ?", [id]);

    console.log({ lesson: lessonResult[0], paragraphs: paragraphResult });

    // Return the lesson with its paragraphs
    res.json({
      lesson: lessonResult[0],
      paragraphs: paragraphResult,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
