/**
 * @param {string} apiKey
 * @param {string} baseId
 */
exports.airTableConnection = (apiKey, baseId) => {
  const Airtable = require('airtable')

  const base = new Airtable({ apiKey }).base(baseId)

  /**
   * @param {string} tableName
   * @return {Promise<{id: string, fields: any}[]>}
   */
  const loadProjects = async (tableName) => {
    return base
      .table(tableName)
      .select()
      .firstPage()
      .then((records) =>
        records.map((record) => ({
          id: record.getId(),
          // TODO map fields to custom data model
          fields: record.fields,
        }))
      )
  }

  return {
    loadProjects,
  }
}
