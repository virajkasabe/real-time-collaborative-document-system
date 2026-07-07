import React, { useState, useEffect } from 'react';
import { FileEdit } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
<<<<<<< HEAD
import { documentService } from '../../utils/documentService';
=======
import { documentService } from '../../services/documentService';
>>>>>>> wind-breathing
import { useAuth } from '../../context/AuthContext';

export default function RenameDocumentModal({
  isOpen,
  onClose,
  document,
  onRename
}) {
  const { triggerToast } = useAuth();
  const [name, setName] = useState('');

  useEffect(() => {
    if (document) {
      setName(document.name);
    }
  }, [document]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      triggerToast('Document title cannot be empty', 'warning');
      return;
    }

    const updated = documentService.update(document.id, { name: name.trim() });
    if (updated) {
      triggerToast('Document renamed successfully', 'success');
      onRename();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rename Document" icon={FileEdit}>
      <form onSubmit={handleSubmit} className="space-y-4 text-left select-none">
        <Input
          label="New Document Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sales Report Q3"
          required
        />

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Rename
          </Button>
        </div>
      </form>
    </Modal>
  );
}
