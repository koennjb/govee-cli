
import { GluegunCommand } from 'gluegun'


const command: GluegunCommand = {
  name: 'govee-cli',
  run: async toolbox => {
    const { print } = toolbox

    print.printHelp(toolbox);
  },
}

module.exports = command
