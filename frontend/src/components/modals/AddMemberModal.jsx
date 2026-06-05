import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export default function AddMemberModal({ isOpen, onClose, onAdd }) {
  const { triggerToast } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) {
      triggerToast('Please complete all form fields', 'warning');
      return;
    }

    onAdd({ email: email.trim(), name: name.trim() });
    setEmail('');
    setName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Member" icon={UserPlus}>
      <form onSubmit={handleSubmit} className="space-y-4 text-left select-none">
        <Input
          label="Collaborator Full Name"
          placeholder="e.g. Jessica Alba"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Teammate Email Address"
          type="email"
          placeholder="e.g. jessica.alba@collabdocs.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Invite Teammate
          </Button>
        </div>
      </form>
    </Modal>
  );
}
