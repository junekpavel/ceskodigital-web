import fetch from 'node-fetch'

export const loadData = <T>(tableName: string): Promise<T[]> => {
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_KEY) {
    throw new Error('API key and base key are both required')
  }
  if (!tableName) {
    throw new Error('Table Name is required')
  }
  return fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_KEY}/${tableName}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
    }
  )
    .then((data) => {
      if (!data.ok) {
        return Promise.reject(
          new Error(`Loading data from ${tableName} failed.`)
        )
      }
      return data.json()
    })
    .then((data: { records: T[] }) => data.records)
}
