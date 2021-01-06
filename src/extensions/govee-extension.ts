import Govee from 'govee-ts';
import { GoveeDevice } from 'govee-ts/lib/device';
import { GoveeToolbox } from '../types';

export interface GoveeTool {
  getApiKey: () => Promise<string | false>;
  saveApiKey: (key: string) => Promise<void>;
  getDevices: () => Promise<GoveeDevice[] | null>;
  getDevice: (name: string) => Promise<GoveeDevice | null>;
  getColor: (colorName: string) => Promise<string | undefined>;
  addColor: (name: string, hex: string) => Promise<boolean>;
  setColor: (name: string, hex: string) => Promise<boolean>;
  getColors: () => Promise<string[][]>;
}

interface GoveeConfig {
  key : string | false;
  colors: string | false;
}
module.exports = (toolbox: GoveeToolbox) => {
  const { filesystem } = toolbox;

  const GOVEE_CONFIG = `${filesystem.homedir()}/.govee-cli`;

  // memoize the API key and colors once we retrieve it
  let goveeKey: string | false = false;
  let goveeColors: Map<string, string> | false = false;

  async function readConfig(): Promise<GoveeConfig | false> {
    if (filesystem.exists(GOVEE_CONFIG)) {
      const fileData = JSON.parse(await filesystem.readAsync(GOVEE_CONFIG)) as GoveeConfig;
      return fileData;
    }
    return false;
  }

  async function writeConfig(config: GoveeConfig): Promise<void> {
    return filesystem.writeAsync(GOVEE_CONFIG, config);
  }

  // read an existing API key from the `GOVEE_CONFIG` file, defined above
  async function readApiKey(): Promise<string | false> {
    const config = await readConfig();
    return config && config.key ? config.key : false;
  }

  async function readColors(): Promise<Map<string, string> | false> {
    const config = await readConfig();
    return config && config.colors ? new Map(JSON.parse(config.colors)) : false;
  }

  // save a new API key to the `GOVEE_CONFIG` file
  async function saveApiKey(key: string): Promise<void> {
    const colors = await getColors();
    const fileData: GoveeConfig = {
      key: key,
      colors: colors && colors.size > 0 ? JSON.stringify(Array.from(colors.entries())) : false,
    }
    return writeConfig(fileData);
  }

  async function saveColors(colors: Map<string, string>): Promise<void> {
    const fileData: GoveeConfig = {
      key: await getApiKey(),
      colors: JSON.stringify(Array.from(colors.entries())),
    }
    return writeConfig(fileData);
  }

  async function setColor(name: string, hex: string): Promise<boolean> {
    await getColors();
    if (goveeColors) {
      goveeColors.set(name, hex);
      await saveColors(goveeColors);
      return true;
    }
    return false;
  }

  async function addColor(name: string, hex: string): Promise<boolean> {
    await getColors();
    if (goveeColors) {
      if (goveeColors.has(name)) {
        return false;
      }
      goveeColors.set(name, hex);
      await saveColors(goveeColors);
      return true;
    }
    return false;
  }

  // get the API key
  async function getApiKey(): Promise<string | false> {
    // if we've already retrieved it, return that
    if (goveeKey) {
      return goveeKey;
    }

    // get it from the config file?
    goveeKey = await readApiKey();

    // return the key
    return goveeKey;
  }

  async function getColors(): Promise<Map<string, string> | false> {
    if (goveeColors) {
      return goveeColors;
    }

    // Otherwise, load it from file
    goveeColors = await readColors();

    if (!goveeColors) {
      // If there is no map yet, create a new one
    goveeColors = new Map<string, string>();
    }
  
    return goveeColors;
  }

  async function getDevices(): Promise<GoveeDevice[] | null> {
    const key = await getApiKey();
    if (!key) return null;

    const goveeClient = new Govee(key);
    return goveeClient.getDevices();
  }

  async function getDevice(name: string): Promise<GoveeDevice | null> {
    const key = await getApiKey();
    if (!key) return null;

    const goveeClient = new Govee(key);
    await goveeClient.getDevices();
    return goveeClient.getDevice(name);
  }

  /**
   * Given a color name, this method returns the hex code of the color or null if there is none.
   */
  async function getColor(colorName: string): Promise<string | undefined> {
    await getColors();
    if (goveeColors) {
      return goveeColors.get(colorName);
    }
  }

  async function listColors(): Promise<string[][]> {
    await getColors();
    if (goveeColors) {
      return Array.from(goveeColors.entries());
    }
    return [];
  }

  // attach our tools to the toolbox
  toolbox.govee = { getApiKey, saveApiKey, getDevices, getDevice, getColor, addColor, getColors: listColors, setColor };
}