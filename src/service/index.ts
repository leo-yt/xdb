import { ConnectParams } from "../interface";

const connect = (params: ConnectParams) => {
  return window.electronAPI.sqlConnect(params)
}
const disConnect = () => {
  return window.electronAPI.sqlDisconnect()
}
const query = (params: any) => {
  return window.electronAPI.sqlQuery(params)
}
const createDatabase = (params: any) => {
  return window.electronAPI.sqlCreateDatabase(params)
}

const dropDatabase = (params: any) => {
  return window.electronAPI.sqlDropDatabase(params)
}

export {
  connect,
  disConnect,
  query,
  createDatabase,
  dropDatabase
}