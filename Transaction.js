import { Model } from '@nozbe/watermelondb';
import { field, relation, date } from '@nozbe/watermelondb/decorators';

export default class Transaction extends Model {
  static table = 'transactions';
  static associations = {
    parties: { type: 'belongs_to', key: 'party_id' },
  };

  @field('currency') currency;
  @field('amount') amount;
  @field('fx_rate') fxRate; // locked at the moment the entry was saved
  @field('pkr_value') pkrValue; // amount * fxRate, precomputed — never recalculated later
  @field('direction') direction; // 'credit' | 'debit'
  @field('note') note;
  @field('synced') synced;
  @date('created_at') createdAt;
  @relation('parties', 'party_id') party;
}
