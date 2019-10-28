import { Connection, createConnection } from 'typeorm'

export class Database {
  private connection!: Connection

  public async connect() {
    if (this.connection) {
      await this.connection.connect()
      return this.connection
    }

    this.connection = await createConnection()
    return this.connection
  }

  public async disconnect() {
    if (this.connection.isConnected) {
      await this.connection.close()
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async executeSQL(sql: string, ...params: any[]) {
    return this.connection.createQueryRunner().query(sql, params)
  }

  public async reset() {
    await this.connection.dropDatabase()
    await this.connection.runMigrations()
  }

  public async runMigrations() {
    await this.connection.runMigrations()
  }

  public async dropDatabase() {
    await this.connection.dropDatabase()
  }
}
