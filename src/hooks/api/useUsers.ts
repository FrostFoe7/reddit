import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { normalizeUser } from "@/types/normalize";

/**
 * Fetch all users
 */
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const data = await api.get<Record<string, unknown>[]>("users");
      return data.map(normalizeUser);
    },
    retry: 2,
    staleTime: 60000,
  });
}

/**
 * Fetch user by username
 */
export function useUser(username: string | undefined) {
  return useQuery({
    queryKey: ["users", username],
    queryFn: async () => {
      if (!username) throw new Error("Username required");
      const data = await api.get<Record<string, unknown>>(`users?username=${username}`);
      return normalizeUser(data);
    },
    enabled: !!username,
    retry: 2,
    staleTime: 45000,
  });
}
