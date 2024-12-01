import { useQueryState } from "nuqs";

export const useParentMessageId = () => useQueryState("parentMessageId");
