jest.mock('node-fetch')

import fetch from 'node-fetch'
import { AirTableConnection } from '../src/airtable-connection'

describe('AirTableConnection', () => {
  test('should throw an error when at least one key not provided', () => {
    expect(
      () =>
        new AirTableConnection(
          (null as unknown) as string,
          (null as unknown) as string
        )
    ).toThrow()
    expect(
      () => new AirTableConnection((null as unknown) as string, 'foo')
    ).toThrow()
    expect(
      () => new AirTableConnection('foo', (null as unknown) as string)
    ).toThrow()
  })

  describe('with both keys provided', () => {
    let connection: AirTableConnection

    beforeEach(() => {
      connection = new AirTableConnection('foo', 'bar')
    })

    test('should create new AirTable connection', () => {
      expect(connection).toBeInstanceOf(AirTableConnection)
    })

    describe('data loading', () => {
      test('should throw error when no table name is provided', () => {
        expect(() => connection.loadData((null as unknown) as string)).toThrow()
      })
      test('should send request to table url', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fetch.mockResolvedValue()
        connection.loadData('foo')
        expect(fetch).toBeCalledWith('https://api.airtable.com/v0/bar/foo', {
          headers: { Authorization: 'Bearer foo' },
        })
      })
      test('should return data when request was successful', async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fetch.mockResolvedValue({
          ok: true,
          json: () => ({
            records: [
              {
                id: '1',
                fields: {
                  Name: 'name',
                  'Tagline CS': ' tagline',
                },
              },
            ],
          }),
        })
        const data = await connection.loadData('foo')
        expect(data).toEqual([
          { id: '1', fields: { Name: 'name', 'Tagline CS': ' tagline' } },
        ])
      })
      test('should throw an error when request was unsuccessful', async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fetch.mockResolvedValue({
          ok: false,
          json: () => ({}),
        })
        await expect(
          async () => await connection.loadData('foo')
        ).rejects.toThrow()
      })
    })
  })
})
