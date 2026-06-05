import React from 'react';
import { ShieldAlert } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function RemoveMemberModal({
  isOpen,
  onClose,
  memberName,
  onConfirm
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Revoke Member Access" icon={ShieldAlert}>
      <div className="space-y-4 text-left select-none">
        <p className="text-xs text-[#081B3A] dark:text-[#E5E7EB] leading-relaxed transition-colors duration-300">
          Are you sure you want to revoke workspace access for <strong>{memberName || 'this collaborator'}</strong>? 
          They will no longer be able to view, edit, or sync changes on this document.
        </p>

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Revoke Access
          </Button>
        </div>
      </div>
    </Modal>
  );
}
