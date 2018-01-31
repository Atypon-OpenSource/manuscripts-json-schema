const { writeFileSync } = require('fs');
const { validate, schemasInUse } = require('./validate');

const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('export', 'Export JSON Schema of expanded (concrete) types')
  .example('$0 export -o schemas.json', 'export schemas to file')
  .alias('o', 'output')
  .nargs('o', 1)
  .describe('o', 'Output file')
  .demandOption(['output'])
  .help('h')
  .alias('h', 'help')
  .argv;

console.log('Writing file to:', argv.output);

const sortObject = o =>
  Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});

writeFileSync(
  argv.output,
  JSON.stringify(schemasInUse.map(sortObject), null, 2),
  'utf8'
);
