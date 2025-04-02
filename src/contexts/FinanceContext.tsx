
import React, { createContext, useContext, useState, useEffect } from "react";

export type Currency = {
  id: string;
  code: string;
  name: string;
  conversionRate: number; // Relative to USD (USD = 1)
};

export type Expense = {
  id: string;
  description: string;
  amount: number;
  currency: string; // Currency code
  date: string;
};

export type ExpenseList = {
  id: string;
  name: string;
  expenses: Expense[];
};

export type Income = {
  id: string;
  description: string;
  amount: number;
  currency: string;
};

type FinanceContextType = {
  currencies: Currency[];
  expenseLists: ExpenseList[];
  incomes: Income[];
  addCurrency: (currency: Omit<Currency, "id">) => void;
  updateCurrency: (id: string, data: Partial<Currency>) => void;
  deleteCurrency: (id: string) => void;
  addExpenseList: (name: string) => void;
  updateExpenseList: (id: string, name: string) => void;
  deleteExpenseList: (id: string) => void;
  addExpense: (listId: string, expense: Omit<Expense, "id">) => void;
  updateExpense: (listId: string, id: string, data: Partial<Expense>) => void;
  deleteExpense: (listId: string, id: string) => void;
  addIncome: (income: Omit<Income, "id">) => void;
  updateIncome: (id: string, data: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
  calculateExpenseTotals: () => { totalInUSD: number; byCurrency: Record<string, number> };
  calculateIncomeTotals: () => { totalInUSD: number; byCurrency: Record<string, number> };
  calculateSavings: () => number;
};

const defaultCurrencies: Currency[] = [
  { id: "usd", code: "USD", name: "US Dollar", conversionRate: 1 },
  { id: "ars", code: "ARS", name: "Argentine Peso", conversionRate: 0.001 }, // Example rate
  { id: "eur", code: "EUR", name: "Euro", conversionRate: 1.1 }, // Example rate
  { id: "btc", code: "BTC", name: "Bitcoin", conversionRate: 60000 }, // Example rate
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load data from localStorage or use defaults
  const [currencies, setCurrencies] = useState<Currency[]>(() => {
    const saved = localStorage.getItem("currencies");
    return saved ? JSON.parse(saved) : defaultCurrencies;
  });

  const [expenseLists, setExpenseLists] = useState<ExpenseList[]>(() => {
    const saved = localStorage.getItem("expenseLists");
    return saved ? JSON.parse(saved) : [];
  });

  const [incomes, setIncomes] = useState<Income[]>(() => {
    const saved = localStorage.getItem("incomes");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("currencies", JSON.stringify(currencies));
  }, [currencies]);

  useEffect(() => {
    localStorage.setItem("expenseLists", JSON.stringify(expenseLists));
  }, [expenseLists]);

  useEffect(() => {
    localStorage.setItem("incomes", JSON.stringify(incomes));
  }, [incomes]);

  // Currency functions
  const addCurrency = (currency: Omit<Currency, "id">) => {
    const id = Date.now().toString();
    setCurrencies([...currencies, { ...currency, id }]);
  };

  const updateCurrency = (id: string, data: Partial<Currency>) => {
    setCurrencies(
      currencies.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  };

  const deleteCurrency = (id: string) => {
    setCurrencies(currencies.filter((c) => c.id !== id));
  };

  // Expense list functions
  const addExpenseList = (name: string) => {
    const id = Date.now().toString();
    setExpenseLists([...expenseLists, { id, name, expenses: [] }]);
  };

  const updateExpenseList = (id: string, name: string) => {
    setExpenseLists(
      expenseLists.map((list) => (list.id === id ? { ...list, name } : list))
    );
  };

  const deleteExpenseList = (id: string) => {
    setExpenseLists(expenseLists.filter((list) => list.id !== id));
  };

  // Expense functions
  const addExpense = (listId: string, expense: Omit<Expense, "id">) => {
    const id = Date.now().toString();
    setExpenseLists(
      expenseLists.map((list) =>
        list.id === listId
          ? { ...list, expenses: [...list.expenses, { ...expense, id }] }
          : list
      )
    );
  };

  const updateExpense = (listId: string, id: string, data: Partial<Expense>) => {
    setExpenseLists(
      expenseLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              expenses: list.expenses.map((e) =>
                e.id === id ? { ...e, ...data } : e
              ),
            }
          : list
      )
    );
  };

  const deleteExpense = (listId: string, id: string) => {
    setExpenseLists(
      expenseLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              expenses: list.expenses.filter((e) => e.id !== id),
            }
          : list
      )
    );
  };

  // Income functions
  const addIncome = (income: Omit<Income, "id">) => {
    const id = Date.now().toString();
    setIncomes([...incomes, { ...income, id }]);
  };

  const updateIncome = (id: string, data: Partial<Income>) => {
    setIncomes(incomes.map((income) => (income.id === id ? { ...income, ...data } : income)));
  };

  const deleteIncome = (id: string) => {
    setIncomes(incomes.filter((income) => income.id !== id));
  };

  // Calculation functions
  const convertToUSD = (amount: number, currencyCode: string): number => {
    const currency = currencies.find((c) => c.code === currencyCode);
    if (!currency) return amount; // Default to no conversion if currency not found
    return amount * currency.conversionRate;
  };

  const calculateExpenseTotals = () => {
    const byCurrency: Record<string, number> = {};
    let totalInUSD = 0;

    expenseLists.forEach((list) => {
      list.expenses.forEach((expense) => {
        // Add to currency totals
        if (!byCurrency[expense.currency]) {
          byCurrency[expense.currency] = 0;
        }
        byCurrency[expense.currency] += expense.amount;

        // Add to USD total
        totalInUSD += convertToUSD(expense.amount, expense.currency);
      });
    });

    return { totalInUSD, byCurrency };
  };

  const calculateIncomeTotals = () => {
    const byCurrency: Record<string, number> = {};
    let totalInUSD = 0;

    incomes.forEach((income) => {
      // Add to currency totals
      if (!byCurrency[income.currency]) {
        byCurrency[income.currency] = 0;
      }
      byCurrency[income.currency] += income.amount;

      // Add to USD total
      totalInUSD += convertToUSD(income.amount, income.currency);
    });

    return { totalInUSD, byCurrency };
  };

  const calculateSavings = () => {
    const incomeTotals = calculateIncomeTotals();
    const expenseTotals = calculateExpenseTotals();
    return incomeTotals.totalInUSD - expenseTotals.totalInUSD;
  };

  return (
    <FinanceContext.Provider
      value={{
        currencies,
        expenseLists,
        incomes,
        addCurrency,
        updateCurrency,
        deleteCurrency,
        addExpenseList,
        updateExpenseList,
        deleteExpenseList,
        addExpense,
        updateExpense,
        deleteExpense,
        addIncome,
        updateIncome,
        deleteIncome,
        calculateExpenseTotals,
        calculateIncomeTotals,
        calculateSavings,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
