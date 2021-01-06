import { GluegunToolbox } from 'gluegun'
import { GoveeTool } from './extensions/govee-extension'

// export types
export interface GoveeToolbox extends GluegunToolbox {
  govee: GoveeTool
}
