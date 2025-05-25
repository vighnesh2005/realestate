import db from '../db/db.js'

export const search = async (req,res)=>{
    const { category, bedrooms, priceLow, priceHigh, type, latitude, longitude } = req.body;
    const userid = req.user?.id;
    const isLoggedIn = userid !== undefined && userid !== null && userid !== '';

let query = `
  SELECT DISTINCT ON (p.id)
    p.*, 
    u.username AS owner, 
    ph.url AS image
    ${isLoggedIn ? `, CASE WHEN l.id IS NOT NULL THEN true ELSE false END AS liked` : ''}
  FROM properties AS p
  LEFT JOIN users AS u ON u.id = p.user_id
  ${isLoggedIn ? `LEFT JOIN liked AS l ON l.propertyid = p.id AND l.userid = $1` : ''}
  LEFT JOIN (
    SELECT DISTINCT ON (property_id) property_id, url
    FROM photos
    ORDER BY property_id, id
  ) ph ON ph.property_id = p.id
  WHERE 1=1
`;

let values = isLoggedIn ? [userid] : [];
let paramIndex = isLoggedIn ? 2 : 1;

    if (category) {
    query += ` AND p.category = $${paramIndex++}`;
    values.push(category);
    }
    if (bedrooms) {
    query += ` AND p.bedrooms = $${paramIndex++}`;
    values.push(parseInt(bedrooms));
    }
    if (priceLow) {
    query += ` AND p.price >= $${paramIndex++}`;
    values.push(parseFloat(priceLow));
    }
    if (priceHigh) {
    query += ` AND p.price <= $${paramIndex++}`;
    values.push(parseFloat(priceHigh));
    }
    if (type) {
    query += ` AND p.type = $${paramIndex++}`;
    values.push(type);
    }
    if (latitude && longitude) {
    query += `
        AND (
          6371 * acos(
            cos(radians($${paramIndex})) * cos(radians(p.latitude)) *
            cos(radians(p.longitude) - radians($${paramIndex+1})) +
            sin(radians($${paramIndex})) * sin(radians(p.latitude))
          )
        ) < 5
    `;
    values.push(parseFloat(latitude), parseFloat(longitude));
    paramIndex += 2;
    } 

    query += ` LIMIT 50`;

    try {
    const results = await db.query(query, values)
    if(results.rowCount > 0)
        res.status(200).json(results.rows)  ;
    else    
        res.status(200).json({message: "no such results"});        
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Internal server error"});
    }
    ;
}
export const view = async (req, res) => {
  try {
    const { propertyid } = req.body;
    const userid = req.body.userid;
    const isLoggedIn = userid !== undefined && userid !== null && userid !== '';

    let detailsQuery = `
      SELECT 
        p.*,u.username as owner,u.profilepic as profile,u.phoneno as phoneno
        ${isLoggedIn ? `, CASE WHEN l.id IS NOT NULL THEN true ELSE false END AS liked` : ''}
      FROM properties AS p
      ${isLoggedIn ? `LEFT JOIN liked AS l ON l.propertyid = p.id AND l.userid = $1` : ''}
      JOIN users as u ON u.id = p.user_id
      WHERE p.id = $${isLoggedIn ? 2 : 1}
    `;

    const detailsValues = isLoggedIn ? [userid, propertyid] : [propertyid];
    const { rows: detailsRows } = await db.query(detailsQuery, detailsValues);

    const { rows: photos } = await db.query(`
      SELECT url 
      FROM photos 
      WHERE property_id = $1
      ORDER BY id
    `, [propertyid]);

    const { rows: reviews } = await db.query(`
      SELECT * 
      FROM reviews 
      WHERE property_id = $1
      ORDER BY id DESC
    `, [propertyid]);

    res.status(200).json({
      details: detailsRows[0] || null,
      photos,
      reviews
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
