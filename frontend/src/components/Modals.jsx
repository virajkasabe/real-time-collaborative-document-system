import AddMemberModal from "./modals/AddMemberModal";
import RemoveMemberModal from "./modals/RemoveMemberModal";
import RenameDocumentModal from "./modals/RenameDocumentModal";
import ShareDocumentModal from "./modals/ShareDocumentModal";

export default function Modals({ isOpen, type, selectedDoc, onSubmit, onClose, documents, teamMembers }) {
  if (!isOpen) return null;

  const commonProps = {
    selectedDoc,
    onSubmit,
    onClose,
    documents,
    teamMembers,
  };

  switch (type) {
    case "invite":
    case "add-member":
      return <AddMemberModal {...commonProps} />;
    case "remove-member":
      return <RemoveMemberModal {...commonProps} />;
    case "rename":
      return <RenameDocumentModal {...commonProps} />;
    case "share":
      return <ShareDocumentModal {...commonProps} />;
    default:
      // Fallback to close for unknown modal types
      return null;
  }
}

