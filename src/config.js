module.exports = {
 	PORT: process.env.PORT || 3000,
	NODE_ENV: process.env.NODE_ENV || 'development',
	DATABASE_URL: process.env.DATABASE_URL,
	JWT_SECRET: process.env.JWT_SECRET || 'curriculum-secrets',
	TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
}