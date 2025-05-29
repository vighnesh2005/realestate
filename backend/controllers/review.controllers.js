import db from '../db/db.js'

export const addreview = async (req,res) => {
    try {
        const {propertyid,rating,review} = req.body;
        const userid = req.user.id;
        
        await db.query(`
            INSERT INTO reviews(reviewer_id,property_id,rating,review) VALUES($1,$2,$3,$4)    
            `,[userid,propertyid,rating,review]);

        const reviews = await db.query(`
        SELECT r.*,u.username,u.profilepic as profilepic
        FROM reviews as r
        JOIN users as u ON u.id = r.reviewer_id
        WHERE property_id = $1
        ORDER BY id DESC
        `, [propertyid]);

        res.status(201).json({reviews:reviews.rows});

    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Internal server error"});
    }
} 