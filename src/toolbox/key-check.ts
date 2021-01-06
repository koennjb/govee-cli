import { GoveeToolbox } from "../types";

const API_MESSAGE = `
Before using the Govee CLI, you'll need an API key.
In the Govee Home app, you can go to the Profile tab -> About Us -> Request API Key
to get one.`

export async function checkKeys(toolbox: GoveeToolbox): Promise<void> {
  if ((await toolbox.govee.getApiKey()) === false) {
    // Prompt for API key
    const result = await toolbox.prompt.ask({
      type: 'input',
      name: 'key',
      message: API_MESSAGE,
    });

    if (result && result.key) {
      await toolbox.govee.saveApiKey(result.key);
    }
  }
}