import { useContext } from 'react';
import ExpensesOutput from '../components/ExpensesOutput';
import { ExpensesContext, Expense } from '../store/expenses-context';

function isWithinLast7Days(date) {
  const today = new Date();
  const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  return date >= weekAgo && date <= today;
}

export default function RecentExpenses() {
  const { expenses } = useContext(ExpensesContext);
  const recent = expenses.filter((e) => isWithinLast7Days(e.date));

  return (
    <ExpensesOutput
      expenses={recent}
      fallbackText="No recent expenses."
    />
  );
}
