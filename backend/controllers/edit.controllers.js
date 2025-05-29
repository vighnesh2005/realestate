import db from "../db/db.js";
import { generateToken } from "../utils/jwt.utils.js";

export const editprop = async (req,res)=>{
  try {
    const {
      id, 
      title, address, city, state, postal_code,
      country, latitude, longitude, price, description,
      type, user_id, bedrooms, category, pictures
    } = req.body;

    if (!id || !user_id) {
      return res.status(400).json({ error: "Missing property ID or user ID" });
    }

    await db.query(`
      UPDATE properties SET
        title = $1,
        address = $2,
        city = $3,
        state = $4,
        postal_code = $5,
        country = $6,
        latitude = $7,
        longitude = $8,
        price = $9,
        description = $10,
        type = $11,
        user_id = $12,
        bedrooms = $13,
        category = $14
      WHERE id = $15
    `, [
      title, address, city, state, postal_code, country,
      parseFloat(latitude), parseFloat(longitude), parseFloat(price),
      description, type, parseInt(user_id), parseInt(bedrooms), category,
      parseInt(id)
    ]);

      await db.query(`DELETE FROM photos WHERE property_id = $1`, [id]);

      for (const url of pictures) {
        await db.query(
          `INSERT INTO photos (url, user_id, property_id) VALUES ($1, $2, $3)`,
          [url, parseInt(user_id), parseInt(id)]
        );
      }

    res.status(200).json({ message: "Property updated successfully", propertyId: id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating property" });
  }
};

export const editprof = async (req,res)=>{
    try {
        const {username,profilepic} = req.body;
        const userid = req.user.id;
        
        const result = await db.query(`
                UPDATE users 
                SET
                username = $1,
                profilepic = $2
                WHERE id = $3
                RETURNING *
            `,[username,profilepic,userid]);
        const user = result.rows[0];
        generateToken(user,res);
        res.status(201).json(user);
        
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Internal Server error"})
    }
}

export const getprofile = async (req,res) => {
  const user = req.user;
  res.status(200).json(user);
}

export const deleteprop = async (req,res) =>{
  try {
    const {propertyId} = req.body;

    db.query(`DELETE FROM properties WHERE id = $1`,[propertyId]);
    res.status(202).json({message:"success"});
  } catch (error) {
        res.status(400).json({message:"Internal Server error"})
  }
}