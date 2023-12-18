const { app, ipcMain } = require('electron');
const { pickObj } = require("./utils");
const mysql= require('mysql2/promise');

const sqlConfig = {
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
}

const INVALID_KEY = ['CREATE DATABASE', 'DROP DATABASE'];

let mysqlConnection;

async function handleConnect(event, args) {
  try {
    const params = pickObj(args, ['host', 'user', 'password', 'database', 'port']);
    const connection = await mysql.createConnection({
      ...params,
      ...sqlConfig
    });
    mysqlConnection = connection;
    const databases = await connection.execute(`SHOW DATABASES`);

    let res;
    if (params.database) {
      const [rows] = await connection.execute(`SHOW TABLES`);
      res = {
        code: 200,
        message: 'success',
        data: {
          databases: databases[0],
          tables: rows
        }
      }
    } else {
      res = {
        code: 200,
        message: 'success',
        data: {
          databases: databases[0],
        }
      }
    }
    return res
  } catch (e) {
    return {
      code: -1,
      message: e.message || '未知错误'
    }
  }
}

async function handleDisConnect() {
  try {
    await mysqlConnection.end();
    return {
      code: 200,
      message: 'success'
    }
  } catch (e) {
    return {
      code: -1,
      message: e.message || '未知错误'
    }
  }
}

async function handleQuery(event, args) {
  if (INVALID_KEY.some(item => args.toUpperCase().startsWith(item))) {
    return {
      code: -1,
      message: `该操作【${args}】不允许使用命令操作`
    }
  }
  try {
    const [rows] = await mysqlConnection.query(args);
    return {
      code: 200,
      message: 'success',
      data: rows,
      sql: args
    }
  } catch (e) {
    return {
      code: -1,
      message: e.message || '未知错误'
    }
  }
}

async function handleCreateDatabase(event, args){
  try {
    const [rows] = await mysqlConnection.query(`CREATE DATABASE ${args}`);
    return {
      code: 200,
      message: 'success',
      data: rows,
    }
  } catch (e) {
    return {
      code: -1,
      message: e.message || '未知错误'
    }
  }
}

async function handleDropDatabase(event, args){
  try {
    const [rows] = await mysqlConnection.query(`DROP DATABASE ${args}`);
    return {
      code: 200,
      message: 'success',
      data: rows,
    }
  } catch (e) {
    return {
      code: -1,
      message: e.message || '未知错误'
    }
  }
}

app.whenReady().then(() => {
  ipcMain.handle('sql:connect', handleConnect);
  ipcMain.handle('sql:disconnect', handleDisConnect);
  ipcMain.handle('sql:query', handleQuery);
  ipcMain.handle('sql:createDatabase', handleCreateDatabase);
  ipcMain.handle('sql:dropDatabase', handleDropDatabase);
})