import { NodeInput, SourceNodesArgs } from 'gatsby'
import { SourceNode } from './interfaces/source-node'

export const createNodesFactory = ({
  actions: { createNode },
  createNodeId,
  createContentDigest,
}: SourceNodesArgs) => (name: string) => <T extends SourceNode>(
  nodeSources: T[]
): void => {
  nodeSources.forEach((nodeSource) => {
    const nodeMeta: NodeInput = {
      id: createNodeId(`${name}-${nodeSource.originalId}`),
      internal: {
        type: name,
        contentDigest: createContentDigest(nodeSource),
      },
    }
    createNode({
      ...nodeSource,
      ...nodeMeta,
    })
  })
}
