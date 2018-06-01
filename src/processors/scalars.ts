const isBitmask = (definition: any) =>
  definition.type === 'integer' &&
  definition.enum &&
  definition.isBitmask;

function possibleValues(input: Array<number>) {
  return Array.from(
    new Set(
      input
        .reduce((acc: Array<Array<number>>, x) => acc.concat(acc.map(y => [x].concat(y))), [[]])
        .filter(xs => xs.length)
        .map(xs => xs.reduce((acc, x) => acc + x))
    )
  ).sort((a, b) => a - b);
}

export const bitmask = (schema: any) => {
  const { definitions } = schema;

  for (const key in definitions) {
    if (isBitmask(definitions[key])) {
      definitions[key] = {
        type: 'integer',
        enum: possibleValues(definitions[key].enum)
      };
    }
  }
  return schema;
}
