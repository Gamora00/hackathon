const db = require('../database');
const util = require('util');
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "upload/")
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    },
})

const upload = multer({storage: storage})

exports.addPolitician = [
    upload.single("image"),
    async (req, res) => {
        const queryAsync = util.promisify(db.query).bind(db);

        try {
            const { firstname, lastname, prefix, suffix, middlename, role, advocacy, province, city,otherAdvocacy } = req.body;
            const image = req.file ? req.file.filename : null;

           
            if (!firstname || !lastname || !role) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const politicianQuery = `
    INSERT INTO politician (firstname, lastname, prefix, suffix, middlename, image, role, province, city)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
const politicianData = [firstname, lastname, prefix, suffix, middlename, image, role, province, city];
            
            console.log(politicianData);
            


            const result = await queryAsync(politicianQuery, politicianData);
            


            if (advocacy && advocacy.length > 0) {

                const uniqueAdvocacy = [...new Set(advocacy)];
            
                const advocacyQuery = `INSERT INTO advocacy (advocacy, politician_Id) VALUES ${uniqueAdvocacy.map(() => "(?, ?)").join(", ")}`;
            
                const advocacyValues = uniqueAdvocacy.flatMap(item => [item, result.insertId]);
            
            
                await queryAsync(advocacyQuery, advocacyValues);
            }
            
            

            res.status(201).json({ message: "Politician added successfully" });

        } catch (error) {
            console.error("Error adding politician:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
];

