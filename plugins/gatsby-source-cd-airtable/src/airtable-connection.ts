import fetch, { RequestInit } from 'node-fetch'
import { AirTableProject } from './interfaces/airtable-project'

export class AirTableConnection {
  constructor(
    private readonly apiKey: string,
    private readonly baseKey: string
  ) {
    // TODO validate api and base key existence
  }

  private buildUrl(tableName: string): string {
    return `https://api.airtable.com/v0/${this.baseKey}/${tableName}`
  }

  private buildRequestOptions(): RequestInit {
    return {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    }
  }

  loadData(tableName: string): Promise<AirTableProject[]> {
    return fetch(this.buildUrl(tableName), this.buildRequestOptions())
      .then((data) => data.json())
      .then((data: { records: AirTableProject[] }) => data.records)
  }
}
