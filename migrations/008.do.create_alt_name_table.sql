CREATE TABLE alt_name (
	id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
	alternate_name TEXT NOT NULL,
	skill_id INTEGER 
		REFERENCES skills(id)
	);