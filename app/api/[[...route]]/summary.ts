// src/routes/summary.ts

import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { subDays, parse, differenceInDays } from "date-fns";
import { and, desc, eq, gte, lte, sql, sum } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { accounts, categories, transactions } from "@/db/schema";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";

const app = new Hono();

app.get(
  "/",
  clerkMiddleware(),
  zValidator(
    "query",
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    const { from, to, accountId } = c.req.valid("query");

    if (!auth?.userId) {
      return c.json({ error: "Não autorizado!" }, 401);
    }

    // Define período atual
    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);
    const startDate = from
      ? parse(from, "dd-MM-yyyy", new Date())
      : defaultFrom;
    const endDate = to ? parse(to, "dd-MM-yyyy", new Date()) : defaultTo;

    // Define período anterior para cálculo de variação
    const periodLength = differenceInDays(endDate, startDate) + 1;
    const lastPeriodStart = subDays(startDate, periodLength);
    const lastPeriodEnd = subDays(endDate, periodLength);

    // Função para buscar totais de income, expenses e remaining
    async function fetchFinancialData(
      userId: string,
      fromDate: Date,
      toDate: Date
    ) {
      return db
        .select({
          income: sql`
            SUM(
              CASE
                WHEN ${transactions.amount} >= 0 THEN ${transactions.amount}
                ELSE 0
              END
            )
          `.mapWith(Number),
          expenses: sql`
            SUM(
              CASE
                WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount})
                ELSE 0
              END
            )
          `.mapWith(Number),
          remaining: sum(transactions.amount).mapWith(Number),
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, userId),
            gte(transactions.date, fromDate),
            lte(transactions.date, toDate)
          )
        );
    }

    // Dados do período atual e anterior
    const [currentPeriod] = await fetchFinancialData(
      auth.userId,
      startDate,
      endDate
    );
    const [lastPeriod] = await fetchFinancialData(
      auth.userId,
      lastPeriodStart,
      lastPeriodEnd
    );

    const incomeChange = calculatePercentageChange(
      currentPeriod.income,
      lastPeriod.income
    );
    const expensesChange = calculatePercentageChange(
      currentPeriod.expenses,
      lastPeriod.expenses
    );
    const remainingChange = calculatePercentageChange(
      currentPeriod.remaining,
      lastPeriod.remaining
    );

    // Top categorias (agora incluindo receitas e despesas)
    const categoryRows = await db
      .select({
        name: categories.name,
        value: sql`
          SUM(
            CASE
              WHEN ${transactions.amount} >= 0 THEN ${transactions.amount}
              ELSE ABS(${transactions.amount})
            END
          )
        `.mapWith(Number),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .groupBy(categories.name)
      .orderBy(
        desc(
          sql`
            SUM(
              CASE
                WHEN ${transactions.amount} >= 0 THEN ${transactions.amount}
                ELSE ABS(${transactions.amount})
              END
            )
          `
        )
      );

    const topCategories = categoryRows.slice(0, 3);
    const others = categoryRows.slice(3);
    const othersSum = others.reduce((acc, cur) => acc + cur.value, 0);
    const finalCategories = [...topCategories];
    if (others.length) {
      finalCategories.push({ name: "Outros", value: othersSum });
    }

    // Dias ativos (income e expenses)
    const activeDays = await db
      .select({
        date: transactions.date,
        income: sql`
          SUM(
            CASE
              WHEN ${transactions.amount} >= 0 THEN ${transactions.amount}
              ELSE 0
            END
          )
        `.mapWith(Number),
        expenses: sql`
          SUM(
            CASE
              WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount})
              ELSE 0
            END
          )
        `.mapWith(Number),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .groupBy(transactions.date)
      .orderBy(transactions.date);

    // Preenche dias sem transações com zeros
    const days = fillMissingDays(activeDays, startDate, endDate);

    // Retorna o JSON final
    return c.json({
      data: {
        incomeAmount: currentPeriod.income,
        incomeChange,
        expensesAmount: currentPeriod.expenses,
        expensesChange,
        remainingAmount: currentPeriod.remaining,
        remainingChange,
        categories: finalCategories,
        days,
      },
    });
  }
);

export default app;
