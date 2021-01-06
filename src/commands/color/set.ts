
import { GoveeToolbox } from '../../types';

module.exports = {
  name: 'set',
  description: 'If the color name exists, this command resets the value. Otherwise, it is added to the list.',
  run: async (toolbox: GoveeToolbox) => {
    // retrieve the tools from the toolbox that we will need
    const { prompt, print, govee, parameters } = toolbox;

    let colorName = parameters.first;

    if (!colorName) {
      const result = await prompt.ask({
        type: 'input',
        name: 'colorName',
        message: 'What is the name of the color you would like to set?',
      });
      if (result && result.colorName) colorName = result.colorName;
    }

    // if they didn't provide one, we error out
    if (!colorName) {
      print.error('No color name specified!');
      return
    }

    let color: string = parameters.second;
    if (!color) {
      const result = await prompt.ask({
        type: 'input',
        name: 'color',
        message: 'What hex color do you want to set the color to?',
      });
      if (result && result.color) color = result.color;
    }

    // if they didn't provide one, we error out
    if (!color) {
      print.error('Please choose a hex color');
      return
    }

    // Todo: add hex validation
    if (color.charAt(0) !== '#') {
      color = "#" + color;
    }

    const spinner = print.spin('Setting color');
    const result = await govee.setColor(colorName, color);
    if (result) {
      spinner.succeed(`Set ${colorName} to ${color}!`);
    }
    else {
      spinner.fail('Error setting the color');
    }
  },
}