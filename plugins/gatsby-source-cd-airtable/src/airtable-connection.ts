import Airtable from 'airtable'

/**
 * Because the original typings are not available for the newest version of airtable plugin, it's necessary to create `AirtableBase` typings manually
 */
interface AirtableBase {
  table: <T extends Airtable.FieldSet>(tableName: string) => Airtable.Table<T>
}

export class AirTableConnection {
  private readonly airTableBase: AirtableBase

  constructor(apiKey: string, baseId: string) {
    this.airTableBase = (new Airtable({ apiKey }).base(
      baseId
    ) as unknown) as AirtableBase
  }

  // TODO use typed model (based on AirTable columns name) instead of `Record<string, unknown>`
  public async loadData(
    tableName: string
  ): Promise<Map<string, Record<string, unknown>>> {
    return this.airTableBase
      .table(tableName)
      .select()
      .firstPage()
      .then(
        (records) =>
          new Map(
            records.map((record) => [
              record.id,
              { originalId: record.id, ...record.fields },
            ])
          )
      )
  }
}
