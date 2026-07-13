import { useEffect, useState } from "react";
import { DOCUMENT_EVENT } from "../utils/constants";
import { fetchDoc } from "../apis/api";

export function useDocumentLoader(id, socket, navigate, showToast, currentUser) {
  const [doc, setDoc] = useState(null);
  const [docUserRole, setDocUserRole] = useState(null);

  useEffect(() => {
    if (!socket) return undefined;

    const loadDocument = async () => {
      try {
        const response = await fetchDoc(id);
        const responseData = response.data.data;
        console.log("res", responseData)
        if (!responseData?.document) {
          showToast('Document not found', 'warning');
          navigate('/dashboard');
          return;
        }
        setDocUserRole(responseData.role);
        setDoc(responseData.document);
        socket.emit(DOCUMENT_EVENT.USER_JOIN, { docId: responseData.document._id || id });
        showToast('Document loaded successfully', 'success');
      } catch (error) {
        console.error('Error fetching document:', error);
        showToast('Failed to load document', 'error');
        navigate('/dashboard');
      }
    };

    loadDocument();

    const handleNewUserJoin = (data) => {
      if (data?.user?._id === currentUser?._id) return;
      if (data?.user) {
        showToast(`${data.user.fullName || 'User'} joined the document`, 'info');
      } else if (data?.message) {
        showToast(data.message, 'info');
      }
    };

    socket.on(DOCUMENT_EVENT.NEW_USER_JOIN, handleNewUserJoin);
    return () => socket.off(DOCUMENT_EVENT.NEW_USER_JOIN, handleNewUserJoin);
  }, [id, socket, navigate, showToast, currentUser]);

  return { doc, docUserRole };
}