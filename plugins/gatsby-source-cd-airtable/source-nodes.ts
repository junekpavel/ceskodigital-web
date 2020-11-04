import { config as configDotEnv } from 'dotenv'
import { AirTableConnection } from './src/airtable-connection'
import { NodeInput, SourceNodesArgs } from 'gatsby'

export const sourceNodes = async ({
  actions: { createNode },
  createNodeId,
  createContentDigest,
}: SourceNodesArgs): Promise<void> => {
  configDotEnv()
  const airTableConnection = new AirTableConnection(
    process.env.AIRTABLE_API_KEY as string,
    process.env.AIRTABLE_BASE_KEY as string
  )

  // TODO use some base model class instead of ` Record<string, unknown>`
  // TODO maybe extract this method to new factory class and create factory methods for all node types with exactly specified types (eg. Project)
  const createNodes = <T extends Record<string, unknown>>(
    name: string,
    nodeSources: Map<string, T>
  ): void => {
    nodeSources.forEach((fields, id) => {
      const nodeMeta: NodeInput = {
        id: createNodeId(`${name}${id}`),
        internal: {
          type: name,
          content: JSON.stringify(fields),
          contentDigest: createContentDigest(fields),
        },
      }
      createNode({
        ...fields,
        ...nodeMeta,
      })
    })
  }

  const projects = await airTableConnection.loadData(
    process.env.AIRTABLE_PROJECTS_TABLE_NAME as string
  )

  const topics = await airTableConnection.loadData(
    process.env.AIRTABLE_TOPICS_TABLE_NAME as string
  )

  // TODO transform projects to models (used in application)
  createNodes('Project', projects)
  createNodes('Topic', topics)
}
