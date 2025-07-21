// screens/ManageExpense.tsx
import React, { useState, useContext, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
  Pressable
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ExpensesContext, Expense } from '../store/expenses-context';

type RootStackParamList = {
  ManageExpense: { expenseId?: string };
};

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Utilities', 'Other'];

export default function ManageExpense() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'ManageExpense'>>();
  const editId = route.params?.expenseId;
  const expensesCtx = useContext(ExpensesContext);

  // If we're editing, find the existing expense
  const existingExpense = editId
    ? expensesCtx.expenses.find(e => e.id === editId)
    : undefined;

  // Form state
  const [amount, setAmount] = useState(
    existingExpense ? existingExpense.amount.toString() : ''
  );
  const [description, setDescription] = useState(
    existingExpense ? existingExpense.description : ''
  );
  const [date, setDate] = useState<Date>(
    existingExpense ? existingExpense.date : new Date()
  );
  const [category, setCategory] = useState<string>(
    existingExpense ? existingExpense.category : CATEGORIES[0]
  );
  const [showPicker, setShowPicker] = useState(false);

  // Update header title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: existingExpense ? 'Edit Expense' : 'Add Expense'
    });
  }, [navigation, existingExpense]);

  function cancelHandler() {
    navigation.goBack();
  }

  function confirmHandler() {
    if (!amount || !description) {
      Alert.alert('Invalid input', 'Please fill out all fields.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      Alert.alert('Invalid input', 'Amount is malformed.');
      return;
    }

    const expenseData: Expense = {
      id: existingExpense ? existingExpense.id : Math.random().toString(),
      amount: parsedAmount,
      date,
      description: description.trim(),
      category
    };

    if (existingExpense) {
      expensesCtx.updateExpense(expenseData);
    } else {
      expensesCtx.addExpense(expenseData);
    }
    navigation.goBack();
  }

  function onChangeDate(_event: any, selectedDate?: Date) {
    // On Android, the picker closes after selection; on iOS, it stays open
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Date</Text>
      <Pressable onPress={() => setShowPicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
      </Pressable>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(val) => setCategory(val)}
        >
          {CATEGORIES.map(cat => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      <View style={styles.buttons}>
        <Button title="Cancel" color="#888" onPress={cancelHandler} />
        <Button title="Save" onPress={confirmHandler} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff'
  },
  label: {
    fontSize: 16,
    marginTop: 12
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
    paddingHorizontal: 2,
    fontSize: 16
  },
  dateButton: {
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 6
  },
  dateText: {
    fontSize: 16
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 6
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24
  }
});
