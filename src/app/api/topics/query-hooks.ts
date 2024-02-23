import { Topic } from "@/db/schema/topics";
import fetchHandler from "@/utils/fetchHandler";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 *
 * Query hook for obtaining the list of all existing Topics
 *
 */
export function useTopicsGetAll() {
  const topics = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      return (await fetchHandler("GET", "topics")) as Topic[];
    },
  });

  return topics;
}

/**
 *
 * Mutation hook for creating a new Topic
 *
 * The mutation function takes a string `topic_name` as a parameter
 *
 */
export function useTopicsCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (topic_name: string) => {
      return await fetchHandler("POST", "topics", { name: topic_name });
    },
    onError: (error) => error,
    onSuccess: () => toast.success("Topic created!"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["topics"] }),
  });
}
