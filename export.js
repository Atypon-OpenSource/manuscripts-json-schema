const { writeFileSync } = require('fs');
const { ajv, schemasInUse, supportedObjectTypes } = require('./validate');
const pack = require('./pack');

const argv = require('yargs')
  .command('schemas', 'export JSON Schema of expanded (concrete) types', yargs => {
    yargs
      .option('output', {
        alias: 'o',
        description: 'output filename'
      })
      .demand('output')
      .help('h')
      .alias('h', 'help');
  })
  .command('function', 'export validator function', yargs => {
    yargs
      .option('output', {
        alias: 'o',
        description: 'output filename'
      })
      .demand('output')
      .help('h')
      .alias('h', 'help');
  })
  .demandCommand()
  .help()
  .argv;

switch (argv._[0]) {
  case 'schemas':
    console.warn('Writing schemas to:', argv.output);
    const sortObject = o =>
      Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
    writeFileSync(
      argv.output,
      JSON.stringify(schemasInUse.map(sortObject), null, 2),
      'utf8'
    );
    break;
  case 'function':
    console.warn('Writing function to:', argv.output);
    const code = pack(supportedObjectTypes, ajv);
    console.log(code);
    // writeFileSync(
      // argv.output,
      // JSON.stringify(schemasInUse.map(sortObject), null, 2),
      // 'utf8'
    // );
    break;
  default:
    throw 'NotImplementedException';

}
