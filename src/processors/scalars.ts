const isBitmask = (definition: any) =>
  definition.type === 'integer' &&
  definition.enum &&
  definition.isBitmask;

export const bitmask = (schema: any) => {
  const { definitions } = schema;
  for (const key in definitions) {
    if (isBitmask(definitions[key])) {
      definitions[key] = {
        type: 'integer',
        minimum: Math.min(...definitions[key].enum),
        maximum: definitions[key].enum.reduce((acc: number, x: number) => acc + x)
      };
    }
  }
  return schema;
}
