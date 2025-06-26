# Insert statement for master administrator
INSERT INTO users
(id, created_date, email, name, password, phone, `position`, profile_image, status, surname, user_role, password_reset_token, immune)
VALUES(0, CURRENT_DATE, 'admin@estiator.io', 'George', '$2a$10$evZ7mfbux9.tKHWtSAoAx.rOTiZ583XcQhVjuTwG/W9wjzz9HTiC.', '+30 6984275822', 'Administrator', '', 0, 'Kalyvianakis', 'ROLE_ADMIN', null, 1);

# Insert statement for `settings` table
INSERT INTO estiator.settings (id,value) VALUES
	 ('businessDescription','The best F&B management platform'),
	 ('businessName','Estiator.io'),
   ('defaultRowsPerPage', '20');

# Insert statement for `dietary-preferences` table
INSERT INTO estiator.`dietary-preferences` (id,description,name) VALUES
	 ('gluten_free','Avoids gluten, typically found in wheat, barley, and rye.','Gluten-Free'),
	 ('halal','Follows Islamic dietary laws including halal meat preparation.','Halal'),
	 ('vegan','Excludes all animal products, including meat, dairy, eggs, and honey.','Vegan'),
	 ('vegetarian','Excludes meat but allows dairy and/or eggs.','Vegetarian');
