import { config } from "dotenv";
import { subDays } from "date-fns";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { categories, accounts, transactions } from "@/db/schema";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const SEED_USER_ID = "user_2jWgSUrnF9oSxZj7OvewBHfG9CI";
const SEED_CATEGORIES = [
  { id: "akbne44p0fz9awxbtu7xm22k", name: "Duplicata", userId: SEED_USER_ID, plaidId: null },
  { id: "ea3skzgoek0mby4sj3ja4iav", name: "Nota Comercial (NC)", userId: SEED_USER_ID, plaidId: null },
  { id: "pxxoolu37xddpee2h6d0d4al", name: "Contrato de Comissária", userId: SEED_USER_ID, plaidId: null },
  { id: "s6q60p74jxth8pysn5jmlb97", name: "Cédula de Crédito Bancária (CCB)", userId: SEED_USER_ID, plaidId: null },
];

const SEED_ACCOUNTS = [
  { id: "zeyzdo0k3jve6tac2jucul55", name: "M7 Coral", userId: SEED_USER_ID, plaidId: null },
  { id: "account_2", name: "Savings", userId: SEED_USER_ID, plaidId: null },
];

const defaultTo = new Date();
const defaultFrom = subDays(defaultTo, 90);

const SEED_TRANSACTIONS: typeof transactions.$inferSelect[] = [];

import { eachDayOfInterval, format } from "date-fns";
import { convertAmountToMinorUnits } from "@/lib/utils";

const generateRandomAmount = (category: typeof categories.$inferInsert) => {
    switch (category.name) {
        case "Duplicata":
            return Math.random() * 400 + 90;
        case "Nota Comercial (NC)":
            return Math.random() * 200 + 50;
        case "Contrato de Comissária":
            return Math.random() * 30 + 10;
        case "Cédula de Crédito Bancária (CCB)":
        case "Health":
            return Math.random() * 50 + 15;
        case "Entertainment":
        case "Clothing":
        case "Miscellaneous":
            return Math.random() * 100 + 20;
        default:
            return Math.random() * 50 + 10;
    }
};

const generateTransactionsForDay = (day: Date) => {
    const numTransactions = Math.floor(Math.random() * 4) + 1;

    for (let i = 0; i < numTransactions; i++) {
        const category = SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)];
        const isExpense = Math.random() > 0.6;
        const amount = generateRandomAmount(category);
        const formattedAmount = convertAmountToMinorUnits(isExpense ? -amount : amount);

        SEED_TRANSACTIONS.push({
            id: `transaction_${format(day, "dd-MM-yyyy")}_${i}`,
            accountId: SEED_ACCOUNTS[0].id,
            categoryId: category.id,
            date: day,
            amount: formattedAmount,
            payee: "Embatec",
            notes: "Operação aleatória",
        });
    }
};

const generateTransactions = () => {
    const days = eachDayOfInterval({ start: defaultFrom, end: defaultTo});
    days.forEach(day => generateTransactionsForDay(day));
};

generateTransactions();

const main = async () => {
    try {
        // Reset - DB
        await db.delete(transactions).execute();
        await db.delete(accounts).execute();
        await db.delete(categories).execute();
        // Seed - Categories
        await db.insert(categories).values(SEED_CATEGORIES).execute();
        // Seed - Accounts
        await db.insert(accounts).values(SEED_ACCOUNTS).execute();
        // Seed - Transactions
        await db.insert(transactions).values(SEED_TRANSACTIONS).execute();
    } catch (error) {
        console.error("Erro durante SEED dos dados: ", error);
        process.exit(1);
    }
};

main().then(() => {
  console.log("Seed finalizado com sucesso!");
});
