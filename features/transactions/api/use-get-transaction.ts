import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { convertAmountFromMinorUnits } from "@/lib/utils";

export const useGetTransaction = (id?: string) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ["transaction", { id }],
        queryFn: async () => {
            const response = await client.api.transactions[":id"].$get({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar operações.");
            }

            const { data } = await response.json();
            return {
                ...data,
                amount: convertAmountFromMinorUnits(data.amount),
            };
        },
    });

    return query;
}