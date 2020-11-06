import { AirTableConnection } from './src/airtable-connection'
import { config as configDotEnv } from 'dotenv'
import { SourceNodesArgs } from 'gatsby'
import { transformProject } from './src/transformers'
import { createNodesFactory } from './src/create-nodes'

export const sourceNodes = async (
  sourceNodesArgs: SourceNodesArgs
): Promise<void> => {
  configDotEnv()
  const airTableConnection = new AirTableConnection(
    process.env.AIRTABLE_API_KEY as string,
    process.env.AIRTABLE_BASE_KEY as string
  )

  const nodesFactory = createNodesFactory(sourceNodesArgs)
  const createProjects = nodesFactory('Project')

  const projects = await airTableConnection.loadData('Projects')

  createProjects(projects.map(transformProject))
}
