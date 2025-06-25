import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.categories.$post>;
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];

export const useCreateCategory = () => {
    const QueryClient = useQueryClient();

    const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Novo instrumento de crédito criado com sucesso.");
            QueryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: () => {
            toast.error("Falha ao criar novo instrumento de crédito.");
        },
    });

    return mutation;
};

