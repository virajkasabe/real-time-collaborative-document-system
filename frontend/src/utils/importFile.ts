import mammoth from 'mammoth';
import { documentService } from '../services/documentService';

export const importDocFile = async (
  file: File,
  user: { fullName?: string; email?: string }
) => {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!['doc', 'docx'].includes(ext || '')) {
    throw new Error('Only .doc and .docx files are supported');
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File must be less than 10MB');
  }

  const arrayBuffer = await file.arrayBuffer();

  const result = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "b => strong",
        "i => em",
        "u => u",
      ]
    }
  );

  const title = file.name
    .replace(/\.(doc|docx)$/i, '')
    .replace(/[-_]/g, ' ')
    .trim();

  const newDoc = documentService.create({
    title,
    content: result.value,
    owner: {
      name: user?.fullName || user?.email?.split('@')[0] || 'User',
      email: user?.email || ''
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isImported: true,
    originalFileName: file.name,
  });

  return newDoc;
};
