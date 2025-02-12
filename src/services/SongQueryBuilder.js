const BuildSongsQuery = async (pool, params = {}) => {
  const { title, performer } = params;

  let baseQuery = 'SELECT id, title, performer FROM song';
  const conditions = [];
  const values = [];

  if (title) {
    conditions.push(`LOWER(title) LIKE LOWER($${conditions.length + 1})`);
    values.push(`%${title}%`);
  }

  if (performer) {
    conditions.push(`LOWER(performer) LIKE LOWER($${conditions.length + 1})`);
    values.push(`%${performer}%`);
  }

  if (conditions.length > 0) {
    baseQuery += ` WHERE ${conditions.join(' AND ')}`;
  }

  const query = {
    text: baseQuery,
    values,
  };

  const result = await pool.query(query);
  return result.rows;
};

module.exports = BuildSongsQuery;
