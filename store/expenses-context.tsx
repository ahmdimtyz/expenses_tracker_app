// store/expenses-context.tsx
import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import {
  expensesCol,
  expensesQuery,
  expenseDoc,
  onSnapshot,
  addDoc,
  setDoc,
  deleteDoc
} from './firebaseConfig';

export interface Expense {
  id:          string;
  description: string;
  amount:      number;
  date:        Date;
  category:    string;
}

type Action =
  | { type: 'SET'; payload: Expense[] }
  | { type: 'ADD'; payload: Expense }
  | { type: 'UPDATE'; payload: Expense }
  | { type: 'DELETE'; payload: { id: string } };

function expensesReducer(state: Expense[], action: Action): Expense[] {
  switch (action.type) {
    case 'SET':
      return action.payload;
    case 'ADD':
      return [action.payload, ...state];
    case 'UPDATE':
      return state.map(e => e.id === action.payload.id ? action.payload : e);
    case 'DELETE':
      return state.filter(e => e.id !== action.payload.id);
    default:
      return state;
  }
}

interface ExpensesContextModel {
  expenses: Expense[];
  addExpense:    (e: Omit<Expense,'id'>) => Promise<void>;
  updateExpense: (e: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

export const ExpensesContext = createContext<ExpensesContextModel>({
  expenses:      [],
  addExpense:    async () => {},
  updateExpense: async () => {},
  deleteExpense: async () => {},
});

export function ExpensesContextProvider({ children }: { children: ReactNode }) {
  const [expensesState, dispatch] = useReducer(expensesReducer, []);

  // 1) Subscribe to Firestore collection
  useEffect(() => {
    const unsubscribe = onSnapshot(expensesQuery, snapshot => {
      const data: Expense[] = snapshot.docs.map(docSnap => {
        const d = docSnap.data() as any;
        return {
          id:          docSnap.id,
          description: d.description,
          amount:      d.amount,
          date:        d.date.toDate(),     // Firestore Timestamp → JS Date
          category:    d.category
        };
      });
      dispatch({ type: 'SET', payload: data });
    });

    return () => unsubscribe();
  }, []);

  // 2) Action wrappers call Firestore

    async function addExpenseHandler(exp: Omit<Expense,'id'>) {
    // use expensesCol, not expensesQuery.parent
    await addDoc(expensesCol, {
        description: exp.description,
        amount:      exp.amount,
        date:        exp.date,
        category:    exp.category
    });
    // your onSnapshot listener will pick up the new doc and dispatch SET
    }

  async function updateExpenseHandler(exp: Expense) {
    await setDoc(expenseDoc(exp.id), {
      description: exp.description,
      amount:      exp.amount,
      date:        exp.date,
      category:    exp.category
    });
  }

  async function deleteExpenseHandler(id: string) {
    await deleteDoc(expenseDoc(id));
  }

  return (
    <ExpensesContext.Provider
      value={{
        expenses: expensesState,
        addExpense:    addExpenseHandler,
        updateExpense: updateExpenseHandler,
        deleteExpense: deleteExpenseHandler
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}
