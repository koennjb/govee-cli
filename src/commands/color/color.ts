import { checkKeys } from '../../toolbox/key-check';
import { GoveeToolbox } from '../../types';

module.exports = {
  name: 'color',
  description: 'Sets the color of a device',
  run: async (toolbox: GoveeToolbox) => {
    // retrieve the tools from the toolbox that we will need
    const { prompt, print, govee, parameters } = toolbox;

    let deviceName = parameters.first;

    if (!deviceName) {
      const result = await prompt.ask({
        type: 'input',
        name: 'deviceName',
        message: 'Which device?',
      });
      if (result && result.deviceName) deviceName = result.deviceName;
    }

    // if they didn't provide one, we error out
    if (!deviceName) {
      print.error('No device name specified!');
      return
    }

    let color: string = parameters.second;
    if (!color) {
      const result = await prompt.ask({
        type: 'input',
        name: 'color',
        message: 'What color?',
      });
      if (result && result.color) color = result.color;
    }

    // if they didn't provide one, we error out
    if (!color) {
      // Todo: improve error message
      print.error('Please choose a color');
      return
    }

    // Check if they passed a HEX code or a color name
    if (!color.includes('#')) {
      const loadedColor = await govee.getColor(color);
      if (!loadedColor) {
        print.warning(`The color: '${color}' does not exist. use 'govee-cli color list' to see all available colors`);
        return;
      }
      color = loadedColor;
    }

    const spinner = print.spin('Loading API Key');
    await checkKeys(toolbox);

    // now, get the device
    spinner.text = 'Loading device';
    const device = await govee.getDevice(deviceName);

    // Check if it exists
    if (!device) {
      print.error(`${deviceName} not found, sorry!`);
      return;
    }
    spinner.text = 'Setting color';
    await device.setHexColor(color);
    spinner.succeed(`Color set for ${deviceName}!`);
  },
}