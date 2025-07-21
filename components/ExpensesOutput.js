import { View, Text, FlatList, StyleSheet } from 'react-native';
import ExpenseItem from './ExpenseItem';
import { Expense } from '../store/expenses-context';

export default function ExpensesOutput({
  expenses,
  fallbackText,
}) {
  if (expenses.length === 0) {
    return (
      <View style={styles.fallback}>
        <Text>{fallbackText}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={expenses}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ExpenseItem {...item} />}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  fallback: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
});
