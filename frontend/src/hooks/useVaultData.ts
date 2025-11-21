import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export interface Vault {
    name: string;
    assets: string[];
    risk: "Low" | "Medium" | "High";
    apy: number;
}

const fetchVaults = async (): Promise<Vault[]> => {
    const { data } = await api.get<Vault[]>("/vaults");
    return data;
};

export const useVaultData = () => {
    return useQuery({
        queryKey: ["vaults"],
        queryFn: fetchVaults,
        staleTime: 60 * 1000, // Data is fresh for 1 minute
        retry: 2, // Retry failed requests twice
    });
};
