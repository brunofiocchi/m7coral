"use client";

import qs from "query-string";
import {
    usePathname,
    useRouter,
    useSearchParams
} from "next/navigation";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useGetSummary } from "@/features/summary/api/use-get-summary";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

export const AccountFilter = () => {
    const router = useRouter();
    const pathname = usePathname();

    const params = useSearchParams();
    const accountId = params.get("accountId") || "all";
    const from = params.get("from") || "";
    const to = params.get("to") || "";

    const {
        isLoading: isLoadingSummary
    } = useGetSummary();
    const {
        data: accounts,
        isLoading: isLoadingAccounts,
    } = useGetAccounts();

    const onChange = (newValue: string) => {
        const query = {
            accountId: newValue,
            from,
            to,
        };

        if (newValue === "all") {
            query.accountId = "";
        }

        const url = qs.stringifyUrl({
            url: pathname,
            query,
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    };

    return (
        <Select
            value={accountId}
            onValueChange={onChange}
            disabled={isLoadingAccounts || isLoadingSummary}
        >
            <SelectTrigger
                className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-cyan-500 hover:bg-cyan-700 border-none text-white placeholder:text-white focus:ring-offset-0 focus:ring-transparent outline-none transition"
            >
                <span className="text-white">
                    <SelectValue placeholder="Selecione uma conta" />
                </span>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todas as contas</SelectItem>
                {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                        {account.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>

    );
};