export default (): Record<string, any> => ({
  databaseConnection: process.env.DATABASE_CONNECTION ?? '',
});
