import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { User } from "@/types";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => api.get<User[]>("users"),
  });
}

export function useUser(username: string | undefined) {
  return useQuery({
    queryKey: ["users", username],
    queryFn: () => api.get<User>(`users?username=${username}`),
    enabled: !!username,
  });
}
