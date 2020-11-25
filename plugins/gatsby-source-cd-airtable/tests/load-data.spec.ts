import { loadData } from '../src/load-data'

jest.mock('node-fetch')

import fetch from 'node-fetch'

describe('loadData', () => {
  test('should throw an error when no key is provided', () => {
    process.env = {}
    expect(() => loadData('tableName')).toThrow()
  })

  test('should throw and error when api key is not provided', () => {
    process.env = {
      AIRTABLE_BASE_KEY: 'key',
    }
    expect(() => loadData('tableName')).toThrow()
  })

  test('should throw and error when base key is not provided', () => {
    process.env = {
      AIRTABLE_API_KEY: 'key',
    }
    expect(() => loadData('tableName')).toThrow()
  })

  describe('with both keys provided', () => {
    beforeEach(() => {
      process.env = {
        AIRTABLE_API_KEY: 'foo',
        AIRTABLE_BASE_KEY: 'bar',
      }
    })

    describe('data loading', () => {
      test('should throw error when no table name is provided', () => {
        expect(() => loadData((null as unknown) as string)).toThrow()
      })
      test('should send request to table url', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fetch.mockResolvedValue()
        loadData('foo')
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
        const data = await loadData('foo')
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
        await expect(async () => await loadData('foo')).rejects.toThrow()
      })
    })
  })
})
