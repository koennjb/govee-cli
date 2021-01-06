import { checkKeys } from '../toolbox/key-check';
import { GoveeToolbox } from '../types';

module.exports = {
  name: 'devices',
  description: 'Lists all Govee devices',
  run: async (toolbox: GoveeToolbox) => {
    // retrieve the tools from the toolbox that we will need
    const { print, govee } = toolbox;
    const spinner = print.spin('Loading API Key');
    await checkKeys(toolbox);

    // now retrieve the info from Govee Client
    spinner.text = 'Loading devices';
    const devices = await govee.getDevices();
    if (devices.length === 0) {
      print.error(`No devices found, sorry!`)
      return
    }
    
    // Top labels
    const table = devices.map(device => {
      const row: string[] = [];
      row.push(device.name, device.model, device.device);
      return row;
    });
    table.unshift(['Name', 'Model', 'MAC']);
    spinner.succeed('Devices loaded');
    // success! We have movie info. Print it out on the screen
    print.table(table, {
      format: 'lean',
    });
  },
}