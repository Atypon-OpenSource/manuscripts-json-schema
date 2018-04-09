import { writeFileSync } from 'fs';
import pack from './pack';
import { ajv, schemas, supportedObjectTypes } from './validate';
import * as yargs from 'yargs';

const argv = yargs
  .command('schemas', 'export JSON Schema of expanded (concrete) types', yargs => {
    return yargs
      .option('output', {
        alias: 'o',
        description: 'output filename'
      })
      .demand('output')
      .help('h')
      .alias('h', 'help');
  })
  .command('function', 'export validator function', yargs => {
    return yargs
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
    writeFileSync(argv.output, JSON.stringify(schemas, null, 2), 'utf8');
    break;
  case 'function':
    console.warn('Writing function to:', argv.output);
    writeFileSync(argv.output, pack(supportedObjectTypes, ajv), 'utf8');
    break;
  default:
    throw 'NotImplementedException';
}
