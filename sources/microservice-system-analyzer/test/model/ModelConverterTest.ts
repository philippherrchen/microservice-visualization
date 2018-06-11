import { describe, it } from 'mocha'
import { expect } from 'chai'
import { Node, Edge } from '~/model/nodeModel'
import { RawNode, RawEdge, RawModelConverter } from '~/model/rawNodeModel'
import { System, Service, Link, Property } from './modelClasses'
import { ModelConverter } from '~/model/ModelConverter'

/* tslint:disable:no-unused-expression */
describe('model converter', function() {

  it('can convert services and links', function() {
    const system: System = {
      name: 'system',
      services: [
        { name: 'A' },
        { name: 'B' }
      ],
      links: [
        { sourceName: 'A', targetName: 'B', communicationType: 'async' }
      ]
    }

    const node = new ModelConverter().convertSystemToNode(system)

    const expectedNode: Node = RawModelConverter.convertToNode({
      id: 'system',
      nodes: [
        { id: 'A' },
        { id: 'B' }
      ],
      edges: [
        { sourceId: 'A', targetId: 'B', props: { communicationType: 'async' } }
      ]
    })

    expect(node).to.deep.equal(expectedNode)
  })

  it('can convert properties', function() {
    const system: System = {
      name: 'system',
      services: [
        {
          name: 'A',
          properties: [
            { name: 'p1', value: 'v1' }
          ]
        }
      ]
    }

    const node = new ModelConverter().convertSystemToNode(system)

    const expectedNode: Node = RawModelConverter.convertToNode({
      id: 'system',
      nodes: [
        {
          id: 'A',
          props: {
            p1: 'v1'
          }
        }
      ]
    })

    expect(node).to.deep.equal(expectedNode)
  })

  it('can convert subsystems', function() {
    const system: System = {
      name: 'system',
      services: [
        { name: 'A' }
      ],
      links: [
        { sourceName: 'A', targetName: 'M', communicationType: 'async' }
      ],
      subSystems: [
        {
          name: 'subsystem',
          services: [
            { name: 'M' },
            { name: 'N' }
          ],
          links: [
            { sourceName: 'M', targetName: 'N', communicationType: 'async' }
          ]
        }
      ]
    }

    const node = new ModelConverter().convertSystemToNode(system)

    const expectedNode: Node = RawModelConverter.convertToNode({
      id: 'system',
      nodes: [
        { id: 'A' },
        {
          id: 'subsystem',
          nodes: [
            { id: 'M' },
            { id: 'N' }
          ],
          edges: [
            { sourceId: 'M', targetId: 'N', props: { communicationType: 'async' } }
          ]
        }
      ],
      edges: [
        { sourceId: 'A', targetId: 'M', props: { communicationType: 'async' } }
      ]
    })

    expect(node).to.deep.equal(expectedNode)
  })
})