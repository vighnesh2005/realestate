function Likedproperties({ likedProperties, onRemove }) {
  return (
    <div className="liked-properties">
      <h2>Liked Properties</h2>
      {likedProperties.length === 0 ? (
        <p>No liked properties.</p>
      ) : (
        <ul>
          {likedProperties.map((property) => (
            <li key={property.id}>
              <span>{property.name}</span>
              <button onClick={() => onRemove(property.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}