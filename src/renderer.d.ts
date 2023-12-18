export interface IElectronAPI {
  sqlConnect: (data: any) => Promise<void>,
  sqlDisconnect: () => Promise<void>,
  sqlQuery: (data: any) => Promise<void>,
  sqlCreateDatabase: (data: any) => Promise<void>,
  sqlDropDatabase: (data: any) => Promise<void>,
}

declare global {
  interface Window {
    electronAPI: IElectronAPI,
  }
}