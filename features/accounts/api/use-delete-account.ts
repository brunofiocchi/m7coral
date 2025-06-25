import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;

export const useDeleteAccount = (id?: string) => {
    const QueryClient = useQueryClient();

    const mutation = useMutation<
    ResponseType,
    Error
    >({
        mutationFn: async () => {
            const response = await client.api.accounts[":id"]["$delete"]({ 
                param: { id }, 
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Conta excluída com sucesso.");
            QueryClient.invalidateQueries({ queryKey: ["account", { id }] });
            QueryClient.invalidateQueries({ queryKey: ["accounts"] });
            QueryClient.invalidateQueries({ queryKey: ["transactions"] });
            QueryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: () => {
            toast.error("Falha ao excluir conta.");
        },
    });

    return mutation;
};

