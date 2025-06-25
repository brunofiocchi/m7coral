import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>;

export const useDeleteTransaction = (id?: string) => {
    const QueryClient = useQueryClient();

    const mutation = useMutation<
    ResponseType,
    Error
    >({
        mutationFn: async () => {
            const response = await client.api.transactions[":id"]["$delete"]({ 
                param: { id }, 
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Operação excluída com sucesso.");
            QueryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
            QueryClient.invalidateQueries({ queryKey: ["transactions"] });
            QueryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: () => {
            toast.error("Falha ao excluir operação.");
        },
    });

    return mutation;
};

