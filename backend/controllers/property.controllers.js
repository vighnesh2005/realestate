import db from "../db/db.js";

export const addproperty = async (req, res) => {
  try {
    const {
      title, address, city, state, postal_code,
      country, latitude, longitude, price, description,
      type, user_id, bedrooms, category, pictures
    } = req.body;

    if (!title || !address || !user_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await db.query(`
      INSERT INTO properties (
        title, address, city, state, postal_code, country,
        latitude, longitude, price, description, type,
        user_id, bedrooms, category
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING id;
    `, [ 
      title, address, city, state, postal_code, country,
      parseFloat(latitude), parseFloat(longitude), parseFloat(price),
      description, type, parseInt(user_id), parseInt(bedrooms), category
    ]);

    const propertyId = result.rows[0].id;
    
    if (pictures && Array.isArray(pictures)) {
      for (const url of pictures) {
        await db.query(
          `INSERT INTO photos (url, user_id, property_id) VALUES ($1, $2, $3)`,
          [url, parseInt(user_id), propertyId]
        );
      }
    }

    res.status(201).json({ message: "Property and image URLs saved", propertyId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding property" });
  }
};


export const getprops = async (req, res) => {
  try {
const userid = req.user?.id;
const isLoggedIn = userid !== undefined && userid !== null && userid !== '';

let query = `
  SELECT 
    p.*,
    u.username AS owner,
    ph.url AS image
    ${isLoggedIn ? `, CASE WHEN l.id IS NOT NULL THEN true ELSE false END AS liked` : ''}
  FROM properties p
  LEFT JOIN users u ON u.id = p.user_id
  LEFT JOIN (
    SELECT DISTINCT ON (property_id) property_id, url
    FROM photos
    ORDER BY property_id, id
  ) ph ON ph.property_id = p.id
  ${isLoggedIn ? `LEFT JOIN liked l ON l.propertyid = p.id AND l.userid = $1` : ''}
  LIMIT 20
`;

const values = isLoggedIn ? [userid] : [];

const results = await db.query(query, values);

    res.json(results.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const like = async (req, res) => {
  try {
    await db.query(
      "INSERT INTO liked(userid, propertyid) VALUES($1, $2)",
      [req.user.id, req.body.property_id]
    );
    res.status(200).json({ message: "Liked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error liking property" });
  }
};

export const dislike = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM liked WHERE userid = $1 AND propertyid = $2",
      [req.user.id, req.body.property_id]
    );
    res.status(200).json({ message: "Disliked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error disliking property" });
  }
};

export const getliked = async (req,res) => {
  try {
const results = await db.query(`
  SELECT 
    p.*, 
    ph.url AS image,
    u.username AS owner
  FROM properties AS p
  JOIN liked AS l ON l.propertyid = p.id
  LEFT JOIN (
    SELECT DISTINCT ON (property_id) property_id, url
    FROM photos
    ORDER BY property_id, id
  ) ph ON ph.property_id = p.id
  LEFT JOIN users u ON u.id = p.user_id
  WHERE l.userid = $1
`, [req.user.id]);


res.status(200).json(results.rows);

  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const getmyprops = async (req,res)=>{
  try {
      const results = await db.query(`
        SELECT 
          p.*, 
          ph.url AS image, 
          u.username AS owner 
        FROM properties AS p
         LEFT JOIN (
    SELECT DISTINCT ON (property_id) property_id, url
    FROM photos
    ORDER BY property_id, id
  ) ph ON ph.property_id = p.id
        LEFT JOIN users AS u ON u.id = p.user_id
        WHERE p.user_id = $1
      `, [parseInt(req.user.id)]);

    res.status(200).json(results.rows);
  } catch (error) {
    console.log(error);
    res.status(400).json("Internal server error");
  }
}