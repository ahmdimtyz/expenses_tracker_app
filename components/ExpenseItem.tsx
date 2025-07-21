// components/ExpenseItem.tsx
import React, { useContext } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ExpensesContext, Expense } from '../store/expenses-context';

type NavigationProps = any; // replace with your stack navigation prop if you have types

export default function ExpenseItem({ id, description, amount, date }: Expense) {
  const { deleteExpense } = useContext(ExpensesContext);
  const navigation = useNavigation<NavigationProps>();

  function deleteHandler() {
    deleteExpense(id);
  }

  function editHandler() {
    navigation.navigate('ManageExpense', { expenseId: id });
  }

  const renderRightActions = () => (
    <Pressable style={styles.deleteButton} onPress={deleteHandler}>
      <Ionicons name="trash" size={24} color="white" />
    </Pressable>
  );

  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={renderRightActions}
    >
      <Pressable
        onPress={editHandler}
        style={({ pressed }) => [styles.item, pressed && styles.pressed]}
      >
        <View style={styles.info}>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.date}>
            {date.toISOString().split('T')[0]}
          </Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>${amount.toFixed(2)}</Text>
        </View>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 6,
    elevation: 2,
  },
  pressed: {
    opacity: 0.75,
  },
  info: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  amountContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff3333',
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    marginVertical: 8,
    borderRadius: 6,
  },
});
