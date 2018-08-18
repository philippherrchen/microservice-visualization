import * as axios from 'axios'
import 'tachyons/css/tachyons.css'
import './html/style.css'
import * as d3 from 'd3'

import { getBaseUrlInCurrentEnvironment } from './appBaseUrl'

import { GraphService } from './domain/service'
import { Node } from './domain/model'
import { NodeActions } from './ui/NodeActions'
import { MenuActions } from './ui/MenuActions'
import { SystemRenderer } from './SystemRenderer'

const queryPart = window.location.href.substr(window.location.href.lastIndexOf('?'))
const systemUrl = getBaseUrlInCurrentEnvironment() + '/system' + queryPart
console.log('fetching system from url ' + systemUrl)

// can also use: axios.defaults.baseURL
axios.default
  .get(systemUrl)
  .then((response) => {
    const rawSystem = response.data
    const system = Node.ofRawNode(rawSystem)
    GraphService.deepResolveNodesReferencedInEdges(system)

    const systemRenderer = new SystemRenderer()
    const graphService = new GraphService(system)
    const nodeActions = new NodeActions(systemRenderer, graphService)
    new MenuActions().install()

    systemRenderer.renderSystem(system)
    nodeActions.install()
  })
  .catch((error) => {
    d3.select('#graph').text(error).classed('f1 pa2 bg-red white', true)
  })
