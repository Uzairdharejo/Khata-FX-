import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'parties',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'phone', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'transactions',
      columns: [
        { name: 'party_id', type: 'string', isIndexed: true },
        { name: 'currency', type: 'string' },
        { name: 'amount', type: 'number' },
        { name: 'fx_rate', type: 'number' },
        { name: 'pkr_value', type: 'number' },
        { name: 'direction', type: 'string' },
        { name: 'note', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'synced', type: 'boolean' },
      ],
    }),
  ],
});
