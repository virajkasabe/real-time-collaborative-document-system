import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { importDocFile } from '../../utils/importFile';

export default function ImportDocButton() {
  const navigate = useNavigate();
  const { user, triggerToast } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState('');

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setProgress('Reading file...');

    try {
      const newDoc = await importDocFile(file, {
        fullName: user?.fullName,
        email: user?.email
      });

      triggerToast(`"${newDoc.name}" imported successfully!`, 'success');

      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Navigate to editor
      navigate(`/editor/${newDoc.id}`);

    } catch (err: any) {
      console.error('Import error:', err);
      triggerToast(err.message || 'Failed to import document. Please try again.', 'error');
    } finally {
      setIsLoading(false);
      setProgress('');
    }
  };

  return (
    <div className="relative">
      <label className={`cursor-pointer flex items-center gap-2
        px-4 py-2.5 rounded-xl border text-xs font-bold
        transition-all duration-200 select-none
        ${isLoading
          ? 'border-blue-500/50 text-blue-400 bg-blue-500/10 cursor-wait'
          : 'border-white/10 text-gray-300 hover:bg-white/5 hover:border-white/20'
        }`}>

        {isLoading ? (
          <>
            <svg className="animate-spin w-4 h-4 text-blue-400"
              viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12"
                r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            {progress || 'Importing...'}
          </>
        ) : (
          <>
            <Upload size={15} />
            Import .docx
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleImport}
          disabled={isLoading}
        />
      </label>
    </div>
  );
}
