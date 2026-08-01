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

  const isDark = theme === 'dark';

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
    <div
      className="editing-page"
      data-page="editor"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: isDark ? '#0d1117' : '#f8fafc',
        color: isDark ? '#ffffff' : '#0f172a',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'background 0.2s ease, color 0.2s ease',
      }}
    >
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      {!localDoc ? (
        <div className="min-h-screen flex items-center justify-center" style={{ background: isDark ? '#0d1117' : '#f8fafc', color: isDark ? 'white' : '#0f172a' }}>
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
    </div>
  );
}

