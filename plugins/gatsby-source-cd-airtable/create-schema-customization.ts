import { SourceNodesArgs } from 'gatsby'

export const createSchemaCustomization = ({
  actions: { createTypes },
  schema,
}: SourceNodesArgs): void => {
  // TODO try linking foreign key relations via gastby ___NODE suffix (https://www.gatsbyjs.com/docs/schema-inference#foreign-key-reference-___node)
  createTypes(`
    type Project implements Node {
        Topics: [Topic]! @link(by: "originalId")
    }

    type Topic implements Node {
        Projects: [Project] @link(by: "originalId")
        name: String
    }

    `)

  // Use default fallback when project has no relation to topics (empty array instead of null)
  createTypes(
    schema.buildObjectType({
      name: 'Project',
      fields: {
        Topics: {
          type: '[Topic!]',
          resolve(source: Record<string, unknown>) {
            const { Topics } = source
            return Array.isArray(Topics) ? Topics : []
          },
        },
      },
    })
  )
}
