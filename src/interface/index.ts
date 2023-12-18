export interface ConnectParams {
  connectType?: 'MySQL' | 'Redis' | 'MongoDB' // TODO
  user: string
  password: string,
  host: string,
  port: string,
  database?: string
}
