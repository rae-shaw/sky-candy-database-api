ALTER TABLE name 
	ADD COLUMN skill_id INTEGER
		REFERENCES skill(id) on delete cascade
;