import { appSchema, tableSchema } from '@nozbe/watermelondb';

// This is the LOCAL, on-device database schema.
// It works fully offline — no internet needed to add/view entries.
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
        { name: 'currency', type: 'string' }, // 'PKR', 'USD', 'AED', 'CNY'
        { name: 'amount', type: 'number' }, // amount in the original currency
        { name: 'fx_rate', type: 'number' }, // rate at the moment this was saved (locked)
        { name: 'pkr_value', type: 'number' }, // amount * fx_rate, computed once and stored
        { name: 'direction', type: 'string' }, // 'credit' (they owe you) or 'debit' (you owe them)
        { name: 'note', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'synced', type: 'boolean' }, // has this reached the backend yet?
      ],
    }),
  ],
});
