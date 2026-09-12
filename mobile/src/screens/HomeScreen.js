import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { database } from '../db';
import { Q } from '@nozbe/watermelondb';

export default function HomeScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const txCollection = database.get('transactions');
    const subscription = txCollection
      .query(Q.sortBy('created_at', Q.desc))
      .observe()
      .subscribe(setTransactions);
    return () => subscription.unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today's ledger</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.currency}>{item.currency} {item.amount.toFixed(2)}</Text>
            <Text style={styles.pkr}>
              {item.direction === 'credit' ? '+' : '-'}Rs {item.pkrValue.toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No entries yet — add your first one below</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NewEntry')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 20, fontWeight: '500', marginBottom: 12 },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 0.5, borderColor: '#ddd',
  },
  currency: { fontSize: 15 },
  pkr: { fontSize: 15, fontWeight: '500' },
  empty: { textAlign: 'center', color: '#888', marginTop: 40 },
  fab: {
    position: 'absolute', right: 20, bottom: 24, width: 56, height: 56,
    borderRadius: 28, backgroundColor: '#0F6E56',
    alignItems: 'center', justifyContent: 'center',
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});
