import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { database } from '../db';

// This is the core differentiator: when the user saves an entry in a foreign
// currency, we fetch (or use a cached) FX rate and LOCK it into this specific
// transaction forever. If tomorrow's rate changes, this entry's PKR value
// never silently changes — that's the whole point of "FX rate locked".
const CURRENCIES = ['PKR', 'USD', 'AED', 'CNY'];

// TODO: replace with a real call to your backend's /fx-rates endpoint,
// falling back to the last cached rate when offline.
const MOCK_RATES = { PKR: 1, USD: 281.4, AED: 76.6, CNY: 39.1 };

export default function NewEntryScreen({ navigation }) {
  const [partyName, setPartyName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const rate = MOCK_RATES[currency];
  const pkrValue = amount ? (parseFloat(amount) * rate).toFixed(0) : '0';

  async function saveEntry() {
    if (!partyName.trim()) {
      setError('Enter a party name first');
      return;
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    setError('');

    await database.write(async () => {
      // Find or create the party
      const parties = database.get('parties');
      let party = await parties.query().fetch();
      let match = party.find((p) => p.name.toLowerCase() === partyName.trim().toLowerCase());
      if (!match) {
        match = await parties.create((p) => {
          p.name = partyName.trim();
          p.createdAt = Date.now();
        });
      }

      // Save the transaction with the FX rate LOCKED at this moment
      await database.get('transactions').create((tx) => {
        tx.partyId = match.id;
        tx.currency = currency;
        tx.amount = parseFloat(amount);
        tx.fxRate = rate;
        tx.pkrValue = parseFloat(amount) * rate;
        tx.direction = 'credit';
        tx.synced = false; // will be picked up by the sync job when online
        tx.createdAt = Date.now();
      });
    });

    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Party</Text>
      <TextInput style={styles.input} value={partyName} onChangeText={setPartyName} placeholder="e.g. Al Habib Traders" />

      <Text style={styles.label}>Currency</Text>
      <View style={styles.chipRow}>
        {CURRENCIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, currency === c && styles.chipActive]}
            onPress={() => setCurrency(c)}
          >
            <Text style={[styles.chipText, currency === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Amount</Text>
      <TextInput style={styles.input} value={amount} onChangeText={setAmount} placeholder="0.00" keyboardType="numeric" />

      <View style={styles.rateCard}>
        <View style={styles.rateRow}>
          <Text style={styles.rateLabel}>Rate locked</Text>
          <Text style={styles.rateValue}>{rate}</Text>
        </View>
        <View style={styles.rateRow}>
          <Text style={styles.rateLabelBold}>PKR value</Text>
          <Text style={styles.rateValueBold}>Rs {parseFloat(pkrValue).toLocaleString()}</Text>
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.saveButton} onPress={saveEntry}>
        <Text style={styles.saveButtonText}>Save entry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  label: { fontSize: 12, color: '#666', marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 0.5, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 15 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#f1f1f1' },
  chipActive: { backgroundColor: '#0F6E56' },
  chipText: { fontSize: 13, color: '#555' },
  chipTextActive: { color: '#fff' },
  rateCard: { backgroundColor: '#f7f7f7', borderRadius: 10, padding: 12, marginTop: 16 },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  rateLabel: { fontSize: 12, color: '#666' },
  rateValue: { fontSize: 12, color: '#666' },
  rateLabelBold: { fontSize: 14, fontWeight: '500' },
  rateValueBold: { fontSize: 14, fontWeight: '500' },
  error: { color: '#c0392b', fontSize: 12, marginTop: 10 },
  saveButton: { backgroundColor: '#BA7517', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: '500' },
});
