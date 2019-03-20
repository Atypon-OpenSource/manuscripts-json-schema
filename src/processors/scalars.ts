const isBitmask = (definition: any) =>
  definition.type === 'integer' && definition.enum && definition.isBitmask;

function possibleBitmaskValues(input: number[]) {
  const combinations = input.reduce(
    (acc: number[][], x) => acc.concat(acc.map(y => [x].concat(y))),
    [[]]
  );

  const sum = (xs: number[]) => xs.reduce((acc, x) => acc + x);

  const totals = combinations.filter(xs => xs.length).map(sum);

  return [...new Set(totals)].sort((a, b) => a - b);
}

export const bitmask = (schema: any) => {
  const { definitions } = schema;

  for (const key in definitions) {
    if (isBitmask(definitions[key])) {
      definitions[key] = {
        type: 'integer',
        enum: possibleBitmaskValues(definitions[key].enum),
      };
    }
  }
  return schema;
};
