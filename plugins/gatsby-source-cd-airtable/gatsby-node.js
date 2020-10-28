require('dotenv').config()
const airTableConnection = require('./src/airtable-connection').airTableConnection(
  process.env.AIRTABLE_API_KEY,
  process.env.AIRTABLE_BASE_KEY
)

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions

  const projects = await airTableConnection.loadProjects(
    process.env.AIRTABLE_PROJECTS_TABLE_NAME
  )

  projects.forEach((project) => {
    const nodeMeta = {
      id: createNodeId(`cd-project-${project.id}`),
      parent: null,
      children: [],
      internal: {
        type: `CDProject`,
        mediaType: `text/html`,
        content: JSON.stringify(project.fields),
        contentDigest: createContentDigest(project.fields),
      },
    }
    const projectNode = Object.assign({}, project.fields, nodeMeta)
    createNode(projectNode)
  })
}
