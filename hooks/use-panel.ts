import { useParentMessageId } from "@/store/use-parent-message-id";
import { useMemberProfileId } from "@/store/use-member-profile-id";

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  const [memberProfileId, setMemberProfileId] = useMemberProfileId();

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
    setMemberProfileId(null);
  };
  const onOpenMemberProfile = (memberId: string) => {
    setMemberProfileId(memberId);
    setParentMessageId(null);
  };

  const onClose = () => {
    setParentMessageId(null);
    setMemberProfileId(null);
  };

  return {
    parentMessageId,
    memberProfileId,
    onOpenMessage,
    onOpenMemberProfile,
    onClose,
  };
};
