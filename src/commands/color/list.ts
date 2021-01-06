import { GoveeToolbox } from '../../types';

module.exports = {
  name: 'list',
  description: 'Lists all saved colors',
  run: async (toolbox: GoveeToolbox) => {
    // retrieve the tools from the toolbox that we will need
    const { print, govee } = toolbox;

    const spinner = print.spin('Loading colors');
    const colors = await govee.getColors();
    if (colors.length === 0) {
      spinner.info('No saved colors. You can add one using `govee color add <name> <hex color>`');
      return;
    }
    spinner.succeed();
    colors.unshift(['Name', 'HEX Color']);
    print.table(colors, {
      format: 'lean',
    });
  },
}