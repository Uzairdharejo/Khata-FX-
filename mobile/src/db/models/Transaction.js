import { Model } from '@nozbe/watermelondb';
import { field, relation, date } from '@nozbe/watermelondb/decorators';

export default class Transaction extends Model {
  static table = 'transactions';
  static associations = {
    parties: { type: 'belongs_to', key: 'party_id' },
  };

  @field('currency') currency;
  @field('amount') amount;
  @field('fx_rate') fxRate;
  @field('pkr_value') pkrValue;
  @field('direction') direction;
  @field('note') note;
  @field('synced') synced;
  @date('created_at') createdAt;
  @relation('parties', 'party_id') party;
}
