import { checkKeys } from '../toolbox/key-check';
import { GoveeToolbox } from '../types';

// TODO: This command calls getDevices first then retrieves the device with matching name. Takes too long
module.exports = {
  name: 'brightness',
  alias: ['b',],
  description: 'Sets the brightness of a devive',
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

    let brightness: number = Number.parseInt(parameters.second, 10);
    if (!brightness || typeof brightness === 'string') {
      const result = await prompt.ask({
        type: 'numeral',
        min: 1,
        max: 100,
        round: true,
        name: 'brightness',
        message: 'What brightness?',
      });
      if (result && result.brightness) brightness = Number.parseInt(result.brightness, 10);
    }

    // if they didn't provide one, we error out
    if (!brightness) {
      print.error('Please choose a brightness between 1-100');
      return
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
    spinner.text = 'Setting brightness';
    await device.setBrightness(brightness);
    spinner.succeed(`Brightness set for ${deviceName}!`);
  },
}