import { checkKeys } from '../toolbox/key-check';
import { GoveeToolbox } from '../types';

module.exports = {
  name: 'off',
  description: 'Turns off a device',
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
  
    await device.turnOff();
    
    spinner.succeed(`${deviceName} turned off!`);
  },
}