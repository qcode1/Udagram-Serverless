export default {
  $schema: "http://json-schema.org/draft-04/schema#",
  title: "group",
  type: "object",
  properties: {
    name: { type: 'string' },
    description: { type: 'string' }
  },
  required: ['name', 'description']
} as const;
