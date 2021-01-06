import { build } from 'gluegun'

/**
 * Create the cli and kick it off
 */
async function run(argv) {
  // create a CLI runtime
  const cli = build()
    .brand('govee-cli')
    .src(__dirname)
    .plugins('./node_modules', { matching: 'govee-cli-*', hidden: true })
    .help() // provides default for help, h, --help, -h
    .version() // provides default for version, v, --version, -v
    .exclude([
      'strings',
      'semver',
      'system',
      'http',
      'template',
      'patching',
      'package-manager'
    ])
    .create()
  // enable the following method if you'd like to skip loading one of these core extensions
  // this can improve performance if they're not necessary for your project:
  // and run it
  const toolbox = await cli.run(argv)

  // send it back (for testing, mostly)
  return toolbox
}

module.exports = { run }
