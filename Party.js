import { Model } from '@nozbe/watermelondb';
import { field, children, date } from '@nozbe/watermelondb/decorators';

export default class Party extends Model {
  static table = 'parties';
  static associations = {
    transactions: { type: 'has_many', foreignKey: 'party_id' },
  };

  @field('name') name;
  @field('phone') phone;
  @date('created_at') createdAt;
  @children('transactions') transactions;
}
