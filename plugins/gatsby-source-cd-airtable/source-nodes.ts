import { AirTableConnection } from './src/airtable-connection'
import { SourceNodesArgs } from 'gatsby'
import { transformProject } from './src/transformers'
import { createNodesFactory } from './src/create-nodes'
import { PluginOptions } from './src/interfaces/plugin-options'

export const sourceNodes = async (
  sourceNodesArgs: SourceNodesArgs,
  options: PluginOptions
): Promise<void> => {

  const airTableConnection = new AirTableConnection(
    process.env.AIRTABLE_API_KEY as string,
    process.env.AIRTABLE_BASE_KEY as string
  )

  const nodesFactory = createNodesFactory(sourceNodesArgs)
  const createProjects = nodesFactory('Project')

  const projects = await airTableConnection.loadData(options.projectsTableName)

  createProjects(projects.map(transformProject))
}
