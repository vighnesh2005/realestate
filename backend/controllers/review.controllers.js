import db from '../db/db.js'

export const addreview = async (req,res) => {
    try {
        const {propertyid,rating,review} = req.body;
        const userid = req.user.id;
        
        const result = await db.query(`
            INSERT INTO reviews(reviewer_id,property_id,rating,review) VALUES($1,$2,$3,$4)    
            RETURNING *       
            `,[userid,propertyid,rating,review]);

        res.status(201).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Internal server error"});
    }
} 