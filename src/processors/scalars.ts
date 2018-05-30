const isBitmask = (definition: any) =>
  definition.type === 'integer' &&
  definition.enum &&
  definition.isBitmask;

export const bitmask = (schema: any) => {
  const { definitions } = schema;

  const possibleValues = (input: Array<number>) =>
    Array.from(
      new Set(
        input
          .reduce((acc: Array<Array<number>>, x) => acc.concat(acc.map(y => [x].concat(y))), [[]])
          .filter(xs => xs.length)
          .map(xs => xs.reduce((acc, x) => acc + x))
      )
    ).sort((a, b) => a - b);

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
