import { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ExpensesOutput from '../components/ExpensesOutput';
import { ExpensesContext, Expense } from '../store/expenses-context';

const CATEGORIES = ['All','Food','Transport','Shopping','Utilities','Other'];

export default function AllExpenses() {
  const { expenses } = useContext(ExpensesContext);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? expenses
    : expenses.filter((e: Expense) => e.category === filter);

  return (
    <View style={styles.screen}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={filter}
          onValueChange={(val) => setFilter(val)}
        >
          {CATEGORIES.map(cat => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>
      <ExpensesOutput
        expenses={filtered}
        fallbackText="No expenses in this category."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 16,
    marginTop: 16,
  },
});
