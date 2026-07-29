import 'quill/dist/quill.snow.css';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import Quill from 'quill';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useTheme } from '../context/ThemeContext';
import { documentService } from '../services/documentService';
import { useDocumentLoader } from '../hooks/useDocumentLoader';
import { useToasts } from '../hooks/useToasts'
import ToastStack from './editor/ToastStack';
import EditingPageContent from './editor/EditingPageContent'


export default function EditingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { socket } = useSocket();
  const { toasts, showToast, dismissToast } = useToasts();

  const { doc, docUserRole } = useDocumentLoader(id, socket, navigate, showToast, user);
  const [localDoc, setLocalDoc] = useState(null);

  useEffect(() => {
    if (doc) setLocalDoc(doc);
  }, [doc]);

  const handleSave = useCallback((newTitle, newContent, words) => {
    let customContent = { ops: [] };
    if (newContent) {
      try {
        if (newContent.ops && Array.isArray(newContent.ops)) {
          customContent = newContent;
        } else {
          const tempQuill = new Quill(document.createElement('div'), { theme: 'snow' });
          tempQuill.clipboard.dangerouslyPasteHTML(newContent);
          customContent = quillDeltaToCustomDelta(tempQuill.getContents());
        }
      } catch (error) {
        console.error('Error converting content:', error);
        customContent = { ops: [{ position: 0, text: newContent, attributes: {} }] };
      }
    }
    const updated = documentService.update(id, { name: newTitle, content: customContent, wordCount: words });
    if (updated) setLocalDoc(updated);
  }, [id]);

  return (
    <>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      {!localDoc ? (
        <div className="min-h-screen bg-[#F7FAFF] dark:bg-[#070B14] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D6EFD]" />
        </div>
      ) : (
        <EditingPageContent
          document={localDoc}
          theme={theme}
          toggleTheme={toggleTheme}
          onBack={() => navigate('/dashboard')}
          onSave={handleSave}
          docUserRole={docUserRole}
          docId={id}
          showToast={showToast}
        />
      )}
    </>
  );
}

