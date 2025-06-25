import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/hono";
import { convertAmountFromMinorUnits } from "@/lib/utils";

export const useGetSummary = () => {
    const params = useSearchParams();
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("accountId") || "";

    const query = useQuery({
        queryKey: ["summary", { from, to, accountId }],
        queryFn: async () => {
            const response = await client.api.summary.$get({
                query: {
                    from,
                    to,
                    accountId
                },
        });

            if (!response.ok) {
                throw new Error("Erro ao buscar resumo.");
            }

            const { data } = await response.json();
            return {
                ...data,
                incomeAmount: convertAmountFromMinorUnits(data.incomeAmount),
                expensesAmount: convertAmountFromMinorUnits(data.expensesAmount),
                remainingAmount: convertAmountFromMinorUnits(data.remainingAmount),
                categories: data.categories.map((category) => ({
                    ...category,
                    value: convertAmountFromMinorUnits(category.value),
                })),
                days: data.days.map((day) => ({
                    ...day,
                    income: convertAmountFromMinorUnits(day.income),
                    expenses: convertAmountFromMinorUnits(day.expenses),
                }))
            }
        },
    });

    return query;
}