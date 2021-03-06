CREATE TABLE skill (
	id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
	primary_name_id INTEGER,
	apparatus_id INTEGER 
		REFERENCES apparatus(id) on delete cascade,
	level_id INTEGER  
		REFERENCES level(id) on delete cascade,
	age_id INTEGER 
		REFERENCES age(id) on delete cascade,
	priority_id INTEGER  
		REFERENCES priority(id) on delete cascade,
	class_id INTEGER 
		REFERENCES class(id) on delete cascade,
	action_id INTEGER  
		REFERENCES action(id) on delete cascade,
	details TEXT,
	prerequisites TEXT,
	warm_up TEXT,
	video VARCHAR(2083)
	);

