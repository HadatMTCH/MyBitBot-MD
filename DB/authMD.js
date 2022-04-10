require("dotenv").config();
const { Pool } = require("pg");

const proConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

//create createCountVideoTable table if not there
const createAuthMDTable = async () => {
  await pool.query("CREATE TABLE IF NOT EXISTS authmd(cred json);");
};

module.exports.getAuthMD = async (groupJid) => {
  await createAuthMDTable();
  let result = await pool.query("SELECT cred FROM authmd;", [groupJid]);
  if (result.rowCount) {
    return result.rows;
  } else {
    return;
  }
};

module.exports.setAuthMD = async (cred) => {
  //check if groupjid is present in DB or not
  await createAuthMDTable();
  let result = await pool.query("select * from authmd;");

  //present
  if (result.rows.length) {
    await pool.query("UPDATE authmd SET cred = $1;", [cred]);
    await pool.query("commit;");
    return count + 1;
  } else {
    await pool.query("INSERT INTO authmd VALUES($1);", [cred]);
    await pool.query("commit;");
    return 1;
  }
};
