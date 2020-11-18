import fetch, { RequestInit } from 'node-fetch'
import { AirTableProject } from './interfaces/airtable-project'

export class AirTableConnection {
  constructor(
    private readonly apiKey: string,
    private readonly baseKey: string
  ) {
    if (!apiKey || !baseKey) {
      throw new Error('API key and base key are both required')
    }
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
    if (!tableName) {
      throw new Error('Table Name is required')
    }
    return fetch(this.buildUrl(tableName), this.buildRequestOptions())
      .then((data) => {
        if (!data.ok) {
          return Promise.reject(new Error('Data loading failed'))
        }
        return data.json()
      })
      .then((data: { records: AirTableProject[] }) => data.records)
  }
}
