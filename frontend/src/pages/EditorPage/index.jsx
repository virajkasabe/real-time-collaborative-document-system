import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Quill from 'quill';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useTheme } from '../../context/ThemeContext';
import { documentService } from '../../services/documentService';
import EditingPageContent from './EditingPageContent';
import ToastStack from './components/ToastStack';
import useDocumentLoader from './hooks/useDocumentLoader';
import useToasts from './hooks/useToasts';
import { quillDeltaToCustomDelta } from './utils/deltaConversion';
import { countWords } from './utils/textHelpers';
import 'quill/dist/quill.snow.css';

// Register custom blots
const BlockEmbed = Quill.import('blots/block/embed');

class PageBreakBlot extends BlockEmbed {
  static create() {
    const node = super.create();
    node.setAttribute('class', 'page-break');
    node.setAttribute('contenteditable', 'false');
    return node;
  }
  static value() {
    return true;
  }
}
PageBreakBlot.blotName = 'pagebreak';
PageBreakBlot.tagName = 'div';
Quill.register(PageBreakBlot);

class DividerBlot extends BlockEmbed {
  static create() {
    const node = super.create();
    node.setAttribute('class', 'quill-divider');
    node.setAttribute('contenteditable', 'false');
    return node;
  }
  static value() {
    return true;
  }
}
DividerBlot.blotName = 'divider';
DividerBlot.tagName = 'hr';
Quill.register(DividerBlot);

export default function EditingPage() {
  const params = useParams();
  const { id } = params;
  console.log("EditingPage index.jsx useParams:", params, "id:", id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { socket } = useSocket();
  const { toasts, showToast, dismissToast } = useToasts();

  const { doc, docUserRole } = useDocumentLoader(id, socket, navigate, showToast, user);
  const [localDoc, setLocalDoc] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved');

  // Keep a local, updatable copy once the document has loaded.
  useEffect(() => {
    if (doc) setLocalDoc(doc);
  }, [doc]);

  const handleSave = useCallback((newTitle, newContent, words) => {
    setSaveStatus('saving');
    try {
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
      if (updated) {
        setLocalDoc(updated);
        setSaveStatus('saved');
        showToast('Document saved successfully.', 'success');
      } else {
        setSaveStatus('error');
        showToast('Failed to save document.', 'error');
      }
    } catch (err) {
      setSaveStatus('error');
      showToast('Failed to save document.', 'error');
    }
  }, [id, showToast]);

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
          saveStatus={saveStatus}
        />
      )}
    </>
  );
}
