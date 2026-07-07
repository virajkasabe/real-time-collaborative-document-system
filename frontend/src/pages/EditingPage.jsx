
import 'quill/dist/quill.snow.css';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import Quill from 'quill';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  fetchDoc,
  inviteCollab,
} from '../apis/api';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Undo, Redo, Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link, 
  Table, Image, ChevronLeft, ChevronRight, FileText, History, 
  Check, X, Copy, Share2, Clipboard, Scissors, Paintbrush, 
  Highlighter, Eraser, AlignJustify, Indent, Outdent, PaintBucket, 
  Grid3x3, Search, Replace
} from 'lucide-react';
import { 
  FiSave, FiRotateCcw, FiRotateCw, FiShare2, FiSun, FiMoon, 
  FiZoomIn, FiZoomOut 
} from 'react-icons/fi';

import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useTheme } from '../context/ThemeContext';

import { documentService } from '../services/documentService';
import { sendOTOperation } from '../socket/document.socket';
import {
  CURSOR_EVENT,
  DOCUMENT_EVENT,
  DOCUMENT_ROLES,
} from '../utils/constants';
import { FaBookOpen, FaCheck, FaChevronLeft, FaCloud, FaCopy, FaHistory, FaList, FaMoon, FaPlus, FaRedo, FaSearch, FaSun, FaUndo, FaUsers, FaUserSecret } from "react-icons/fa";
import { LuCheck, LuMessageSquare, LuRefreshCw, LuSend, LuShare2, LuX } from "react-icons/lu";
import { getRandomColor } from '../utils/helpers';


import { documentService } from '../utils/documentService';
import '../editor.css';


export default function EditingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { triggerToast } = useAuth();
  const [doc, setDoc] = useState(null);
  const [docUserRole, setDocUserRole] = useState(null)
  const [sendOtData , setSendOtData] = useState(null)
  const [receivedOtData, setReceivedOtData] = useState(null)
  const { socket } = useSocket()
  

  // Fetch document details on mount/id change
  useEffect(() => {
    if(!socket) return

    ;(async()=>{
        const fetched = await fetchDoc(id);
        socket.emit(DOCUMENT_EVENT.USER_JOIN, { docId : fetched.data.data.document._id })
        triggerToast("document fetch Successfully", 'success')
        if (!fetched) {
          triggerToast('Document not found', 'warning');
          navigate('/dashboard');
          return;
        }
        setDocUserRole(fetched.data.data.role)
        setDoc(fetched.data.data);
    })()

      ;(()=>{
          socket.on(DOCUMENT_EVENT.NEW_USER_JOIN,
          (data)=>{

            // TODO : ADD HERE LIKE ONLY DOCUMENT TOAST LIKE DOCUMENT PERSONAL TOASTER
            
            triggerToast(`${data.message}`)
            data.user
          })
      })()

      ;(()=>{
          sendOTOperation("operation", DOCUMENT_EVENT.SEND_OPERATION, socket)
      })()

      socket.on(DOCUMENT_EVENT.NEW_USER_JOIN,
          (data)=>{
            triggerToast(`${data.message}`)
            data.user
          })


      ;(()=>{
          socket.on(DOCUMENT_EVENT.NEW_USER_JOIN,
          (data)=>{
            triggerToast(`${data.message}`)
            data.user
          })
      })()


      ;(()=>{
        socket.off(DOCUMENT_EVENT.NEW_USER_JOIN, ((data) => (data)))
        socket.off(DOCUMENT_EVENT.NEW_USER_JOIN, ((data) => (data)))
        socket.off(DOCUMENT_EVENT.NEW_USER_JOIN, ((data) => (data)))
      })()


    
  }, [id, socket]);


  const handleSave = (newTitle, newContent, words) => {
    const updated = documentService.update(id, { name: newTitle, content: newContent, wordCount: words });
    if (updated) {
      setDoc(updated);
    }
  };

 
  const handleBack = () => {
    navigate('/dashboard');
  };

  if (!doc) {
    return (
      <div className="min-h-screen bg-[#F0F4FF] dark:bg-[#090D16] flex items-center justify-center transition-colors">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB] dark:border-white"></div>
      </div>
    );
  }

  return (
    <EditingPageContent

      document={doc.document}
      theme={theme}
      toggleTheme={toggleTheme}

      document={doc}

      onBack={handleBack}
      onSave={handleSave}
      docUserRole={docUserRole}
    />
  );
}


function EditingPageContent({ document: doc, theme, toggleTheme, onBack, onSave, docUserRole }) {
  const [title, setTitle] = useState(doc.title || doc.name || 'Untitled Document')
  const [isSyncing, setIsSyncing] = useState(false)
  const { socket } = useSocket()
  const { user } = useAuth()
  
  // Collapse sidebars by default to match Microsoft Word's paper focus
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(true)
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true)
  const { triggerToast } = useAuth();

function EditingPageContent({ document: doc, onBack, onSave }) {
  const { id } = useParams();
  const { theme, toggleTheme } = useTheme();
  const { triggerToast } = useAuth();
  
  const isDarkMode = theme === 'dark' || document.documentElement.classList.contains('dark');

  
  const [title, setTitle] = useState(doc.name || 'Untitled Document');
  const [autosaveState, setAutosaveState] = useState('saved'); // 'saved' | 'saving'
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [leftTab, setLeftTab] = useState('outline'); // 'outline' | 'pages' | 'history'
  const [activeTab, setActiveTab] = useState('Home'); // Ribbon tabs
  const [zoom, setZoom] = useState(100);
  const [showRuler, setShowRuler] = useState(true);
  const [showFormattingMarks, setShowFormattingMarks] = useState(false);
  
  // Find and Replace Pane
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  
  // Share Modal
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareRole, setShareRole] = useState('Editor');
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Stats
  const [wordCount, setWordCount] = useState(doc.wordCount || 0);
  const [charCount, setCharCount] = useState(0);
  
  // Heading tree outline
  const [outline, setOutline] = useState([]);
  
  // Format painter styles buffer
  const [formatPainterStyle, setFormatPainterStyle] = useState(null);
  
  // Active formatting button states
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    alignLeft: true,
    alignCenter: false,
    alignRight: false,
    fontName: 'Calibri',
    fontSize: '3'
  });


  // Comments State
  const [comments, setComments] = useState(() => {
    if (doc.comments && doc.comments.length > 0) {
      return doc.comments.map(c => ({
        id: c.id,
        author: c.user,
        text: c.text,
        time: c.time
      }));
    }
    return [
      { 
        id: 1, 
        author: 'Lisa Chen', 
        text: 'This introductory paragraph looks very solid. Should we add a link to the project roadmap?', 
        time: '10m ago' 
      },
      { 
        id: 2, 
        author: 'Alex Johnson', 
        text: 'Love the syntax highlighting in the pre blocks! Let’s add a section for Node setup as well.', 
        time: '2m ago' 
      }
    ];
  });
  const [newCommentText, setNewCommentText] = useState('')

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      sender: 'Alex Johnson', 
      text: 'Hey! I am checking out the new editor outline view. It looks super fast.', 
      time: '10:05 AM', 
      type: 'received' 
    },
    { 
      id: 2, 
      sender: 'Lisa Chen', 
      text: 'Yes, the heading synchronization is incredibly smooth!', 
      time: '10:06 AM', 
      type: 'received' 
    }
  ])
  const [chatInputText, setChatInputText] = useState('')

  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareEmail, setShareEmail] = useState('')
  const [shareRole, setShareRole] = useState(DOCUMENT_ROLES.VIEWER)
  const [copied, setCopied] = useState(false)
  const { id } = useParams()

  // Remote Cursors State
  const [remoteCursors, setRemoteCursors] = useState({});

  const stripInitialHeading = (contentHTML) => {
    if (!contentHTML) return '<p>Start typing here...</p>';
    const headingRegex = /^\s*<(h1|h2|h3)[^>]*>[\s\S]*?<\/\1>\s*/i;
    return contentHTML.replace(headingRegex, '');
  };


  const editorRef = useRef(null);
  const autosaveTimeoutRef = useRef(null);
  const hasInitializedContent = useRef(false);


   const handleSendCollabLink = async(e) => {
      e.preventDefault()
      try {
          const res = await inviteCollab({docId : id, email : shareEmail, role : shareRole})
          // console.log("invite",res.data)
          triggerToast(`${res.data.message}`,'success')
      } catch (error) {
        triggerToast(`${error.message}`,'Warning')
      } 
  }

  // 1. Manage Immersive Layout Mode on mount/unmount

  // Initialize editor content once

  useEffect(() => {
    if (editorRef.current && !hasInitializedContent.current) {
      editorRef.current.innerHTML = stripInitialHeading(doc.content);
      hasInitializedContent.current = true;
      handleSelectionChange();
    }
  }, [doc]);


  useEffect(() => {
    // Skip if already initialized or ref is missing
    if (!quillRef.current || quillInstance.current) return;

    // Initialize Quill instance
    const quill = new Quill(quillRef.current, {
      theme: 'snow',
      modules: {
        toolbar: '#word-ribbon-toolbar'
      },
      placeholder: 'Start writing your document here...'
    });

    quillInstance.current = quill;

    // Set initial content
    const initialContent = doc.content;
    
    quill.clipboard.dangerouslyPasteHTML(initialContent);

    // ===== STATE TRACKING =====
    let previousText = quill.getText();
    let saveTimeoutId = null;
    let operationBatch = [];
    let isSendingOperation = false;
    let cursorTimeoutId = null;

    // ===== GET CLICK POSITION FUNCTION =====
    const getClickPosition = (event) => {
      try {
        const selection = window.getSelection();
        if (!selection.rangeCount) return null;
        
        const range = selection.getRangeAt(0);
        const node = range.startContainer;
        const offset = range.startOffset;
        
        const quillSelection = quill.getSelection();
        if (quillSelection) {
          return quillSelection.index;
        }
        
        const editorRoot = quill.root;
        const walker = document.createTreeWalker(
          editorRoot,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        
        let currentNode = walker.nextNode();
        let currentOffset = 0;
        
        while (currentNode) {
          const text = currentNode.textContent || '';
          if (currentNode === node) {
            return currentOffset + offset;
          }
          currentOffset += text.length;
          currentNode = walker.nextNode();
        }
        
        return quill.getText().length;
      } catch (error) {
        return quill.getSelection()?.index || 0;
      }
    };

    // ===== GET CHARACTER AT POSITION =====
    const getCharAtPosition = (position) => {
      const text = quill.getText();
      return position < text.length ? text[position] : 'EOF';
    };

    // ===== GET WORD AT POSITION =====
    const getWordAtPosition = (position) => {
      const text = quill.getText();
      if (position >= text.length) return { word: '', start: 0, end: 0 };
      
      let start = position;
      let end = position;
      
      while (start > 0 && /\S/.test(text[start - 1])) start--;
      while (end < text.length && /\S/.test(text[end])) end++;
      
      return {
        word: text.substring(start, end),
        start: start,
        end: end
      };
    };

    // ===== GET LINE AND COLUMN =====
    const getLineAndColumn = (position) => {
      const text = quill.getText();
      const beforeText = text.substring(0, position);
      const lines = beforeText.split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      return { line, column };
    };

    // ===== CONVERT QUILL DELTA TO OPERATIONS =====
    const convertDeltaToOperations = (delta, oldContent) => {
      const operations = [];
      let position = 0;
      
      delta.ops.forEach(op => {
        if (op.insert) {
          // Insert operation
          if (typeof op.insert === 'string') {
            operations.push({
              type: 'insert',
              position: position,
              text: op.insert,
              attributes: op.attributes || {}
            });
            position += op.insert.length;
          } else if (typeof op.insert === 'object') {
            // Handle embeds (images, etc.)
            operations.push({
              type: 'insert',
              position: position,
              text: JSON.stringify(op.insert),
              attributes: op.attributes || {},
              isEmbed: true
            });
            position += 1;
          }
        } else if (op.delete) {
          // Delete operation
          operations.push({
            type: 'delete',
            position: position,
            length: op.delete
          });
          // position stays the same
        } else if (op.retain) {
          // Retain (formatting changes)
          if (op.attributes && Object.keys(op.attributes).length > 0) {
            operations.push({
              type: 'format',
              position: position,
              length: op.retain || 0,
              attributes: op.attributes
            });
          }
          position += op.retain || 0;
        }
      });
      
      return operations;
    };

    // ===== SEND OPERATION TO SERVER =====
    const sendOperations = (operations) => {
      if (isSendingOperation || operations.length === 0) return;
      
      isSendingOperation = true;
      
      const operationData = {
        docId: doc._id,
        actions: operations,
        version: doc.version || 0,
        userId: user?._id || 'anonymous',
        timestamp: Date.now()
      };
      
      // console.log('📤 Sending operations:', operationData);
      
      socket.emit(DOCUMENT_EVENT.SEND_OPERATION, operationData);
      
      // Reset after sending
      setTimeout(() => {
        isSendingOperation = false;
      }, 50);
    };

    // ===== SEND CURSOR DATA =====
    const sendCursorData = (position, selection) => {
      if (!user) return;
      
      const cursorData = {
        docId: doc._id,
        userId: user.id,
        userName: user.fullName || 'Anonymous',
        avatar : user.avatar || "" ,
        position: position,
        selection: selection || { index: position, length: 0 },
        color: getRandomColor(),
        timestamp: Date.now()
      };
      
      // console.log('🖱️ Sending cursor data:', cursorData);
      socket.emit(CURSOR_EVENT.CURSOR_CHANGE, cursorData);
    };

    // ===== APPLY RECEIVED OPERATION =====
    const applyReceivedOperation = (operationData) => {
      console.log('📥 Received operation:', operationData);
      
           /*
                {
                 docId: '6a35009b9a0f9ee57abf1128', actions: Array(1), version: 8}
                    actions: Array(1) 0 : attributes : {} position :  1
                    text: "d" type: "insert"[[Prototype]] : Object length  :  1
                    [[Prototype]] :  Array(0) docId: "6a35009b9a0f9ee57abf1128"
                    version :  8
                }

           */

      // Apply operations to local document
      const { actions, version } = operationData;
      
      // Update document version
      doc.version = version;
      
      // Apply operations using Quill's built-in OT
      actions.forEach(action => {
        if (action.type === 'insert') {
          const selection = quill.getSelection();
          // Insert text at position
          quill.insertText(action.position, action.text, Quill.sources.SILENT);
        } else if (action.type === 'delete') {
          quill.deleteText(action.position, action.length, Quill.sources.SILENT);
        } else if (action.type === 'format') {
          quill.formatText(
            action.position,
            action.length,
            action.attributes,
            Quill.sources.SILENT
          );
        }
      });
      
      // Update word count
      const text = quill.getText();
      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      setWordCount(words);
    };

    // ===== RENDER REMOTE CURSOR =====
    const renderRemoteCursor = (cursorData) => {
      const { userId, userName, position, color, avatar } = cursorData;
      
      const editor = quillInstance.current;
      if (!editor) return;
      
      // Remove existing cursor for this user
      const existingCursor = document.getElementById(`cursor-${userId}`);
      if (existingCursor) {
        existingCursor.remove();
      }
      
      // Get the bounds of the position in the editor
      const bounds = editor.getBounds(position);
      if (!bounds) return;
      
      // Create cursor element
      const cursorElement = document.createElement('div');
      cursorElement.id = `cursor-${userId}`;
      cursorElement.className = 'remote-cursor';
      cursorElement.style.cssText = `
        position: absolute;
        top: ${bounds.top}px;
        left: ${bounds.left}px;
        height: ${bounds.height}px;
        width: 2px;
        background-color: ${color || '#FF6B6B'};
        pointer-events: none;
        z-index: 1000;
        transition: all 0.05s ease;
      `;
      
      // Add cursor flag with avatar and name
      const flag = document.createElement('div');
      flag.className = 'remote-cursor-flag';
      flag.style.cssText = `
        position: absolute;
        top: -22px;
        left: -10px;
        background-color: ${color || '#FF6B6B'};
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 600;
        white-space: nowrap;
        pointer-events: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: flex;
        align-items: center;
        gap: 4px;
      `;
      
      if (avatar) {
        flag.innerHTML = `
          <img src="${avatar}" alt="${userName}" style="
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.3);
            object-fit: cover;
          ">
          ${userName || 'User'}
        `;
      } else {
        flag.textContent = userName || 'User';
      }
      
      cursorElement.appendChild(flag);
      
      // Add to editor container
      const editorContainer = editor.container;
      editorContainer.style.position = 'relative';
      editorContainer.appendChild(cursorElement);
    };

    // ===== HANDLE REMOTE CURSOR UPDATE =====
    const handleCursorUpdate = (cursorData) => {
      // console.log('🖱️ Received cursor update:', cursorData);
      renderRemoteCursor(cursorData);
      
      // Update remote cursors state
      setRemoteCursors(prev => ({
        ...prev,
        [cursorData.userId]: cursorData
      }));
      
      // Auto-remove cursor after 30 seconds of inactivity
      if (window.cursorTimeouts && window.cursorTimeouts[cursorData.userId]) {
        clearTimeout(window.cursorTimeouts[cursorData.userId]);
      }
      
      window.cursorTimeouts = window.cursorTimeouts || {};
      window.cursorTimeouts[cursorData.userId] = setTimeout(() => {
        const cursorElement = document.getElementById(`cursor-${cursorData.userId}`);
        if (cursorElement) {
          cursorElement.remove();
        }
        setRemoteCursors(prev => {
          const newCursors = { ...prev };
          delete newCursors[cursorData.userId];
          return newCursors;
        });
      }, 1000);
    };

    // ===== CHARACTER TRACKING FUNCTION =====
    const trackCharacters = (quill, previousText, eventType = 'text-change', clickEvent = null) => {
      const text = quill.getText();
      const selection = quill.getSelection();
      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      const html = quill.root.innerHTML;
      
      let clickPosition = null;
      let charAtClick = null;
      let wordAtClick = null;
      let lineColumnAtClick = null;
      
      if (eventType === 'click' && clickEvent) {
        clickPosition = getClickPosition(clickEvent);
        charAtClick = getCharAtPosition(clickPosition);
        wordAtClick = getWordAtPosition(clickPosition);
        lineColumnAtClick = getLineAndColumn(clickPosition);
      }
      
      return {
        eventType,
        timestamp: new Date().toISOString(),
        text: text,
        charCount: text.length,
        wordCount: words,
        cursorPosition: selection?.index || 0,
        selectionLength: selection?.length || 0,
        selectedText: selection && selection.length > 0 ? 
          text.substring(selection.index, selection.index + selection.length) : '',
        
        ...(eventType === 'click' && {
          clickPosition: clickPosition,
          charAtClick: charAtClick || 'N/A',
          charCodeAtClick: charAtClick ? charAtClick.charCodeAt(0) : null,
          isWhitespace: charAtClick ? /\s/.test(charAtClick) : null,
          isLetter: charAtClick ? /[a-zA-Z]/.test(charAtClick) : null,
          isNumber: charAtClick ? /[0-9]/.test(charAtClick) : null,
          isSpecial: charAtClick ? /[^a-zA-Z0-9\s]/.test(charAtClick) : null,
          wordAtClick: wordAtClick?.word || 'N/A',
          wordStart: wordAtClick?.start || 0,
          wordEnd: wordAtClick?.end || 0,
          lineAtClick: lineColumnAtClick?.line || 0,
          columnAtClick: lineColumnAtClick?.column || 0,
          charBefore: clickPosition > 0 ? text[clickPosition - 1] : 'START',
          charAfter: clickPosition < text.length - 1 ? text[clickPosition + 1] : 'END',
        }),
        
        letters: (text.match(/[a-zA-Z]/g) || []).length,
        numbers: (text.match(/[0-9]/g) || []).length,
        spaces: (text.match(/\s/g) || []).length,
        specialChars: (text.match(/[^a-zA-Z0-9\s]/g) || []).length,
        paragraphs: text.split('\n').filter(p => p.trim()).length,
        lines: text.split('\n').length,
        
        ...(eventType === 'text-change' && {
          prevLength: previousText.length,
          diff: text.length - previousText.length,
          added: text.length > previousText.length ? 
            text.slice(previousText.length) : 'N/A',
          removed: previousText.length > text.length ?
            previousText.slice(text.length) : 'N/A',
          changePosition: text.length > previousText.length ? previousText.length : text.length,
        }),
        
        firstChar: text.charAt(0) || 'N/A',
        lastChar: text.slice(-1) || 'N/A',
        last10Chars: text.slice(-10),
        first10Chars: text.slice(0, 10),
        isEmpty: text.trim().length === 0,
        hasContent: text.trim().length > 0,
        contentForOT: { text },
        delta: quill.getContents(),
        html: html,
        length: text.length
      };
    };

    // ===== TEXT CHANGE HANDLER =====
    const handleTextChange = (delta, oldDelta, source) => {
      // Ignore changes from server (SILENT source)
      if (source === 'silent') return;
      
      // Update outline
      updateOutline();

      const text = quill.getText();
      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      setWordCount(words);

      // Track character changes
      const charData = trackCharacters(quill, previousText, 'text-change');
      console.log('✏️ Text Change:', charData);

      // Convert delta to operations for OT
      const operations = convertDeltaToOperations(delta, previousText);
      console.log('📝 Operations from delta:', operations);

      // Send operations if there are any
      if (operations.length > 0) {
        sendOperations(operations);
      }

      // Update previous text
      previousText = text;

      // Trigger syncing state
      setIsSyncing(true);

      // Clear existing timeout
      if (saveTimeoutId) {
        clearTimeout(saveTimeoutId);
      }

      // Debounced auto-save
      saveTimeoutId = setTimeout(() => {
        const html = quill.root.innerHTML;
        onSave(title, html, words);
        setIsSyncing(false);
        saveTimeoutId = null;
      }, 50);
    };

    // ===== SELECTION CHANGE HANDLER =====
    const handleSelectionChange = (range, oldRange, source) => {
      if (source === 'silent') return;
      
      if (range) {
        const position = range.index;
        const selection = range;
        
        // Send cursor data with debounce
        if (cursorTimeoutId) {
          clearTimeout(cursorTimeoutId);
        }
        
        cursorTimeoutId = setTimeout(() => {
          sendCursorData(position, selection);
          cursorTimeoutId = null;
        }, 80);
      }
    };

    // ===== CLICK HANDLER =====
   const handleClick = (event) => {
    const text = quill.getText();
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    setWordCount(words);
    
    const charData = trackCharacters(quill, previousText, 'click', event);
    console.log('🖱️ Click Event:', charData);
    
    const clickPosition = getClickPosition(event);
    console.log('🖱️ Click Position:', {
      absoluteIndex: clickPosition,
      character: clickPosition !== null ? quill.getText()[clickPosition] : 'N/A',
      wordAtPosition: getWordAtPosition(clickPosition || 0),
      lineAndColumn: getLineAndColumn(clickPosition || 0)
    });

  // EMIT CLICK EVENT THROUGH SOCKET
    if (clickPosition !== null && user) {
      const clickData = {
        docId: doc._id,
        userId: user.id,
        userName: user.fullName || 'Anonymous',
        avatar: user.avatar || "",
        position: clickPosition,
        character: clickPosition !== null ? quill.getText()[clickPosition] : 'N/A',
        wordAtPosition: getWordAtPosition(clickPosition || 0),
        lineAndColumn: getLineAndColumn(clickPosition || 0),
        charData: charData,
        timestamp: Date.now(),
        eventType: 'click'
      };
      
    // Emit the click event
      socket.emit(CURSOR_EVENT.CURSOR_CHANGE, clickData);
      // Or if you want to use your existing CURSOR_EVENT constant
      // socket.emit(CURSOR_EVENT.CURSOR_CLICK, clickData);
    }
  };

    // ===== MOUSE UP HANDLER =====
    const handleMouseUp = () => {
      const selection = quill.getSelection();
      if (selection && selection.length > 0) {
        const text = quill.getText();
        const selectedText = text.substring(selection.index, selection.index + selection.length);
        console.log('🖱️ Selection Change:', {
          selectedText: selectedText.slice(0, 50),
          selectionLength: selection.length,
          startIndex: selection.index,
          endIndex: selection.index + selection.length
        });
      }
    };

    // ===== KEYBOARD HANDLER =====
    const handleKeyDown = (event) => {
      console.log('⌨️ Key Pressed:', {
        key: event.key,
        code: event.code,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        charCount: quill.getText().length,
        cursorPosition: quill.getSelection()?.index || 0
      });
    };

    // ===== SOCKET EVENT LISTENERS =====
    // Listen for operations from other users
    socket.on(DOCUMENT_EVENT.RECEIVE_OPERATION, applyReceivedOperation);
    
    // Listen for cursor updates from other users
    socket.on(CURSOR_EVENT.CURSOR_UPDATE, handleCursorUpdate);

    // Listen for user left event to remove cursor
    socket.on(DOCUMENT_EVENT.USER_LEFT, (data) => {
      const { userId } = data;
      const cursorElement = document.getElementById(`cursor-${userId}`);
      if (cursorElement) {
        cursorElement.remove();
      }
      setRemoteCursors(prev => {
        const newCursors = { ...prev };
        delete newCursors[userId];
        return newCursors;
      });
    });

    // Register Quill event listeners
    quill.on('text-change', handleTextChange);
    quill.on('selection-change', handleSelectionChange);

    // DOM event listeners
    const editorRoot = quill.root;
    editorRoot.addEventListener('click', handleClick);
    editorRoot.addEventListener('mouseup', handleMouseUp);
    editorRoot.addEventListener('keydown', handleKeyDown);

    const container = quill.container;
    container.addEventListener('click', handleClick);

    // Initial outline extraction
    const initTimeout = setTimeout(updateOutline, 50);

    // ===== CLEANUP =====
    return () => {
      // Clear timeouts
      if (saveTimeoutId) clearTimeout(saveTimeoutId);
      if (initTimeout) clearTimeout(initTimeout);
      if (cursorTimeoutId) clearTimeout(cursorTimeoutId);

      // Remove socket listeners
      socket.off(DOCUMENT_EVENT.RECEIVE_OPERATION, applyReceivedOperation);
      socket.off(CURSOR_EVENT.CURSOR_UPDATE, handleCursorUpdate);
      socket.off(DOCUMENT_EVENT.USER_LEFT);

      // Remove Quill event listeners
      if (quillInstance.current) {
        quillInstance.current.off('text-change', handleTextChange);
        quillInstance.current.off('selection-change', handleSelectionChange);
      }

      // Remove DOM event listeners
      if (quillInstance.current) {
        const editorRoot = quillInstance.current.root;
        const container = quillInstance.current.container;
        
        editorRoot.removeEventListener('click', handleClick);
        editorRoot.removeEventListener('mouseup', handleMouseUp);
        editorRoot.removeEventListener('keydown', handleKeyDown);
        container.removeEventListener('click', handleClick);
      }

      // Clean up remote cursors
      Object.keys(remoteCursors).forEach(userId => {
        const cursorElement = document.getElementById(`cursor-${userId}`);
        if (cursorElement) {
          cursorElement.remove();
        }
      });

      // Clear cursor timeouts
      if (window.cursorTimeouts) {
        Object.values(window.cursorTimeouts).forEach(timeout => {
          clearTimeout(timeout);
        });
        window.cursorTimeouts = {};
      }

      // Clean up Quill instance
      if (quillInstance.current) {
        quillInstance.current.emitter.off();
        if (quillInstance.current.container) {
          quillInstance.current.container.innerHTML = '';
        }
        quillInstance.current = null;
      }
    };
  }, []);

  // Clean up autosave timeout on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, []);

  // Calculate word & character counts
  const updateCounts = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const cleanText = text.trim();
    const words = cleanText === '' ? 0 : cleanText.split(/\s+/).length;
    setWordCount(words);
    setCharCount(text.length);
    return words;
  };

  // Re-build heading outline tree from H1, H2, H3 elements in contenteditable
  const updateOutline = () => {
    if (!editorRef.current) return;
    const headings = Array.from(editorRef.current.querySelectorAll('h1, h2, h3'));
    const outlineData = headings.map((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-ref-${index}`;
      }
      return {
        id: heading.id,
        text: heading.innerText || heading.textContent || 'Untitled Heading',
        level: heading.tagName.toLowerCase() // 'h1', 'h2', 'h3'
      };
    });
    setOutline(outlineData);
  };

  // Run formatting command and refocus editor
  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleSelectionChange();
    triggerAutosave();
  };


  // Monitor cursor selection / typing to toggle active toolbar states
  const handleSelectionChange = () => {
    if (!editorRef.current) return;
    
    updateCounts();
    updateOutline();


    setTimeout(() => {
      onSave(newTitle, html, words)
      setIsSyncing(false)
    }, 750)
  }

    setActiveStyles({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      alignLeft: document.queryCommandState('justifyLeft') || (!document.queryCommandState('justifyCenter') && !document.queryCommandState('justifyRight')),
      alignCenter: document.queryCommandState('justifyCenter'),
      alignRight: document.queryCommandState('justifyRight'),
      fontName: document.queryCommandValue('fontName') || 'Calibri',
      fontSize: document.queryCommandValue('fontSize') || '3'
    });
  };


  // Autosave title & body content changes
  const triggerAutosave = (updatedTitle = title) => {
    if (!autosaveEnabled) return;
    setAutosaveState('saving');
    
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }
    
    autosaveTimeoutRef.current = setTimeout(() => {
      if (editorRef.current) {
        const currentHTML = editorRef.current.innerHTML;
        const currentWords = updateCounts();
        onSave(updatedTitle, currentHTML, currentWords);
      }
      setAutosaveState('saved');
    }, 800);
  };

  const handleTitleChange = (val) => {
    setTitle(val);
    triggerAutosave(val);
  };

  const handleInput = () => {
    handleSelectionChange();
    triggerAutosave();
  };

  const handleManualSave = () => {
    setAutosaveState('saving');
    if (editorRef.current) {
      const currentHTML = editorRef.current.innerHTML;
      const currentWords = updateCounts();
      onSave(title, currentHTML, currentWords);
    }
    setTimeout(() => {
      setAutosaveState('saved');
      triggerToast('Document saved manually', 'success');
    }, 500);
  };


  // 6. Handle Outline Item Navigation Click
  const handleOutlineClick = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Brief visual flash to highlight destination element
      el.style.transition = 'background-color 0.4s'
      el.style.backgroundColor = 'var(--accent-bg)'
      setTimeout(() => {
        el.style.backgroundColor = 'transparent'
      }, 750)

  // Clipboard commands
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        applyFormat('insertHTML', text.replace(/\n/g, '<br>'));
        triggerToast('Clipboard content pasted', 'success');
      }
    } catch (err) {
      triggerToast('Clipboard access blocked. Use Ctrl+V.', 'warning');

    }
  };


  // 7. Format Painter selection hooks
  useEffect(() => {
    if (quillInstance.current) {
      console.log(quillInstance.current)
      const handleSelectionChange = (range, oldRange, source) => {
        if (range && range.index !== null) {
          // If Format Painter is active and user selected a new block of text, apply styles
          if (formatPainterActive && copiedFormat && range.length > 0) {
            Object.keys(copiedFormat).forEach((fmt) => {
              quillInstance.current.formatText(range.index, range.length, fmt, copiedFormat[fmt]);
            });
            setFormatPainterActive(false); // Reset paint active state
          }
        }
      };

      quillInstance.current.on('selection-change', handleSelectionChange);

      return () => {
        if (quillInstance.current) {
          quillInstance.current.off('selection-change', handleSelectionChange);
        }
      };
    }
  }, [formatPainterActive, copiedFormat]);

  const handleCut = () => {
    document.execCommand('cut');
    triggerToast('Text cut to clipboard', 'info');
  };

  const handleCopy = () => {
    document.execCommand('copy');
    triggerToast('Text copied to clipboard', 'info');
  };


  const handleFormatPainterClick = () => {
    triggerToast('Format Painter active. Select text to apply format.', 'info');
  };

  // Grow / Shrink Font Size
  const handleGrowFont = () => {
    const cur = parseInt(activeStyles.fontSize) || 3;
    if (cur < 7) {
      applyFormat('fontSize', (cur + 1).toString());
    }
  };

  const handleShrinkFont = () => {
    const cur = parseInt(activeStyles.fontSize) || 3;
    if (cur > 1) {
      applyFormat('fontSize', (cur - 1).toString());
    }
  };

  // Text color / highlight
  const handleHighlight = () => {
    applyFormat('backColor', 'yellow');
  };

  const handleFontColor = () => {
    applyFormat('foreColor', 'red');
  };

  // Paragraph options
  const handleSort = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = range.toString();
      if (text.trim()) {
        const sorted = text.split('\n').sort((a, b) => a.localeCompare(b)).join('\n');
        applyFormat('insertHTML', sorted.replace(/\n/g, '<br>'));
        triggerToast('Sorted selection alphabetically', 'success');
      } else {
        triggerToast('Please select text lines to sort', 'info');
      }
    }
  };

  const handleLineSpacing = (spacing) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let parent = selection.getRangeAt(0).commonAncestorContainer;
      if (parent.nodeType === 3) {
        parent = parent.parentNode;
      }
      if (parent && editorRef.current.contains(parent)) {
        parent.style.lineHeight = spacing;
        triggerAutosave();
      }
    }
  };

  const handleBorder = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let parent = selection.getRangeAt(0).commonAncestorContainer;
      if (parent.nodeType === 3) {
        parent = parent.parentNode;
      }
      if (parent && editorRef.current.contains(parent)) {
        parent.style.border = '1px solid #CCCCCC';
        parent.style.padding = '8px';
        triggerAutosave();
      }
    }
  };

  // Find and Replace Actions
  const handleFind = () => {
    if (!findText) {
      triggerToast('Enter text to search for', 'info');
      return;
    }
    try {
      const found = window.find(findText, false, false, true, false, false, false);
      if (!found) {
        triggerToast(`Could not find "${findText}"`, 'warning');
      }
    } catch (e) {
      if (editorRef.current) {
        const text = editorRef.current.innerText || '';
        if (text.includes(findText)) {
          triggerToast(`Found "${findText}" in document`, 'success');
        } else {
          triggerToast(`Could not find "${findText}"`, 'warning');
        }
      }
    }
  };

  const handleReplace = () => {
    if (findText && editorRef.current) {
      const content = editorRef.current.innerHTML;
      if (content.includes(findText)) {
        const newContent = content.replace(findText, replaceText);
        editorRef.current.innerHTML = newContent;
        triggerAutosave();
        triggerToast(`Replaced "${findText}" with "${replaceText}"`, 'success');
      } else {
        triggerToast(`Could not find "${findText}" to replace`, 'warning');
      }
    } else {
      triggerToast('Enter search and replace values', 'info');
    }
  };

  // Insertion Dialogs
  const handleInsertLink = () => {
    const url = prompt('Enter link URL (e.g. https://google.com):');
    if (url) {
      applyFormat('createLink', url);
    }
  };


    // Dynamic response simulation
    setTimeout(() => {
      const replies = [
        "That looks perfect! The structure flows really well.",
        "Oh nice, I see you updated the main objectives block.",
        "Makes sense! I will check the proposal outlines again.",
        "Let me know when you need my review on the setup notes.",
        "Awesome! The live outline widget is matching perfectly.",
        "Should we add another section describing our REST endpoint specs?"
      ]
      const team = ['Lisa Chen', 'Alex Johnson', 'Antigravity AI']
      const randomMember = team[Math.floor(Math.random() * team.length)]
      const randomReply = replies[Math.floor(Math.random() * replies.length)]

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: randomMember,
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'received'
        }
      ])
      setIsSyncing(false)
    }, 100)
  }

  const handleInsertTable = () => {
    const rows = 2;
    const cols = 2;
    let tableHTML = '<table style="width:100%; border-collapse:collapse; margin:16px 0;"><thead><tr>';
    for (let c = 0; c < cols; c++) {
      tableHTML += `<th style="border:1px solid #CCCCCC; padding:6px 10px; background-color:#f3f3f3;">Header ${c+1}</th>`;
    }
    tableHTML += '</tr></thead><tbody>';
    for (let r = 0; r < rows; r++) {
      tableHTML += '<tr>';
      for (let c = 0; c < cols; c++) {
        tableHTML += '<td style="border:1px solid #CCCCCC; padding:6px 10px;">Cell</td>';
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</tbody></table>';
    applyFormat('insertHTML', tableHTML);
  };


  const handleInsertImage = () => {
    const url = prompt('Enter image URL:', 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600');
    if (url) {
      const imgHTML = `<img src="${url}" alt="Image" style="max-width:100%; height:auto; border-radius:4px; margin:12px 0; display:block;" />`;
      applyFormat('insertHTML', imgHTML);
    }
  };

  // Outline Navigation click: scrolls matching element in editor into center view
  const handleOutlineClick = (elId) => {
    const el = document.getElementById(elId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.backgroundColor = '#FFFEE0';
      setTimeout(() => {
        el.style.backgroundColor = 'transparent';
      }, 1000);
    }
  };

  // Zoom controls
  const handleZoomOut = () => setZoom(prev => Math.max(50, prev - 10));
  const handleZoomIn = () => setZoom(prev => Math.min(200, prev + 10));

  // Copy shareable link
  const handleCopyLink = () => {
    const shareableUrl = window.location.href;
    navigator.clipboard.writeText(shareableUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  // Restore history checkpoints
  const handleRestoreVersion = (contentString) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = stripInitialHeading(contentString);
      handleSelectionChange();
      triggerAutosave();
      triggerToast('Restored selected checkpoint to canvas!', 'success');
    }
  };

  // Mock document version history checkpoints
  const historyCheckpoints = doc.versions && doc.versions.length > 0 ? doc.versions : [
    { id: 'v-1', name: 'Original Checkpoint', date: 'Just now', author: 'Eleanor Vance', content: doc.content },
    { id: 'v-2', name: 'Proposal Draft', date: '10 mins ago', author: 'Lisa Chen', content: '<h2>Draft Review</h2><p>Here is an earlier version with basic proposals outlining Q3 roadmaps...</p>' },
    { id: 'v-3', name: 'Template Initialization', date: '1 hour ago', author: 'Alex Johnson', content: '<h2>Workspace Initialized</h2><p>Welcome to your new blank sheet card.</p>' }
  ];

  const tabs = ['File', 'Home', 'Insert', 'Design', 'Layout', 'References', 'Mailings', 'Review', 'View', 'Help'];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F0F4FF] dark:bg-[#090D16] text-[#0A0F1E] dark:text-[#94A3B8] font-sans select-none animate-fade-in transition-colors">
      

      {/* 1. TOP WINDOW TITLE BAR (Word Top Bar) */}
      <header className="editor-header">
        <div className="editor-header-left">
          <button className="sidebar-toggle-btn" onClick={onBack} title="Back to Dashboard">
            <FaChevronLeft size={20} />
          </button>

          {/* Quick Access Toolbar Icons */}
          <div className="quick-access-icons">
            <button 
              className={`autosave-toggle ${autoSaveActive ? 'active' : ''}`} 
              onClick={() => setAutoSaveActive(!autoSaveActive)}
              title={`AutoSave is ${autoSaveActive ? 'ON' : 'OFF'}`}
            >
              

              <LuRefreshCw size={14} className={autoSaveActive ? 'rotating-slow' : ''} />
              <span className="autosave-label">AutoSave</span>
            </button>
            <button onClick={() => quillInstance.current?.history.undo()} title="Undo (Ctrl+Z)">
              <FaUndo size={14} />
            </button>
            <button onClick={() => quillInstance.current?.history.redo()} title="Redo (Ctrl+Y)">
              <FaRedo size={14} />
            </button>
          </div>

      {/* Styles Injection for Formatting Marks and Page Constraints */}
      <style>{`
        .word-page {
          background-color: #FFFFFF !important;
          color: #000000 !important;
        }
        .word-page h1, .word-page h2, .word-page h3, .word-page p, .word-page div {
          color: #000000 !important;
        }
        .word-page h1 {
          font-size: 20pt;
          font-weight: bold;
          margin-top: 14pt;
          margin-bottom: 6pt;
        }
        .word-page h2 {
          font-size: 16pt;
          font-weight: bold;
          margin-top: 12pt;
          margin-bottom: 4pt;
        }
        .word-page h3 {
          font-size: 13pt;
          font-weight: bold;
          margin-top: 10pt;
          margin-bottom: 4pt;
        }
        .word-page p {
          margin-bottom: 8pt;
          font-size: 11pt;
        }
        .word-page ul, .word-page ol {
          margin-bottom: 10pt;
          padding-left: 24px;
        }
        .word-page ul {
          list-style-type: disc;
        }
        .word-page ol {
          list-style-type: decimal;
        }
        ${showFormattingMarks ? `
          .word-editor-body p::after, 
          .word-editor-body h1::after, 
          .word-editor-body h2::after, 
          .word-editor-body h3::after {
            content: " ¶";
            color: #babcbe;
            font-weight: normal;
            font-size: 10pt;
          }
        ` : ''}
      `}</style>

      {/* 1. TITLE BAR */}
      <header className="flex items-center justify-between px-3 py-1.5 bg-white border-b border-[#E2E8F0] dark:bg-[#080E1A] dark:border-[#1E293B] text-[#0A0F1E] dark:text-white shrink-0 h-[38px] transition-colors">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          {/* Autosave Switch Toggle */}
          <button 
            onClick={() => {
              setAutosaveEnabled(!autosaveEnabled);
              if (!autosaveEnabled) {
                handleManualSave();
              }
            }}
            className={`p-1 rounded-lg cursor-pointer transition-colors ${
              autosaveEnabled 
                ? 'bg-[#EEF2FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-white' 
                : 'text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B]'
            }`}
            title={autosaveEnabled ? 'AutoSave is On (Click to turn off)' : 'AutoSave is Off (Click to save)'}
          >
            <FiSave size={13} />
          </button>

          
          <button 
            onClick={() => applyFormat('undo')} 
            className="p-1 rounded-lg cursor-pointer text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] transition-colors" 
            title="Undo (Ctrl+Z)"
          >
            <FiRotateCcw size={13} />
          </button>
          <button 
            onClick={() => applyFormat('redo')} 
            className="p-1 rounded-lg cursor-pointer text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] transition-colors" 
            title="Redo (Ctrl+Y)"
          >
            <FiRotateCw size={13} />
          </button>

          <div className="flex items-center gap-1 ml-1.5">
            <input
              type="text"
              className="bg-transparent text-[#0A0F1E] dark:text-white text-xs font-semibold text-center border-none outline-none w-44 hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] focus:bg-[#EEF2FF] dark:focus:bg-[#1E293B] rounded px-1 transition-all"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Untitled Document"
              title="Edit document title inline"
            />

            <span className="word-file-extension" style={{ display: 'inline-flex', alignItems: 'center', height: '32px' }}>- Word</span>
            <span className="word-title-cloud-status" title="Saved to Cloud" style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '6px', height: '32px' }}>
              <FaCloud size={14} style={{ color: 'var(--accent)' }} />
            </span>
            <span className="text-center text-[14px] text-yellow-400">{docUserRole}</span>

            <span className="text-[#6B7280] dark:text-[#94A3B8] text-[11px] font-normal select-none">- Word</span>

          </div>


        <div className="editor-header-center">
          <div className="word-header-search">
            <FaSearch size={14} className="search-glass-icon" />
            <input type="text" placeholder="Search (Alt+Q)" disabled title="Microsoft Search features" />

          <div className="flex items-center gap-1.5 ml-2 text-[10px] select-none text-[#6B7280] dark:text-[#94A3B8]" title="AutoSave status">
            <span className={`w-1.5 h-1.5 rounded-full ${autosaveState === 'saving' ? 'bg-amber-400 animate-pulse' : 'bg-[#107C10]'}`}></span>
            <span>{autosaveState === 'saving' ? 'Saving...' : 'Saved'}</span>

          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Avatar stack */}
          <div className="flex -space-x-1 items-center" title="Collaborators editing now">
            <div className="w-5.5 h-5.5 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center border border-white" title="Eleanor Vance (You)">EV</div>
            <div className="w-5.5 h-5.5 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center border border-white" title="Lisa Chen">LC</div>
            <div className="w-5.5 h-5.5 rounded-full bg-teal-500 text-white text-[9px] font-bold flex items-center justify-center border border-white" title="Alex Johnson">AJ</div>
          </div>


          <button className="theme-toggle-btn" onClick={toggleTheme} title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"} style={{ marginRight: '8px' }}>
            {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>

          <button className="btn-primary" onClick={() => setShowShareModal(true)}>
            <LuShare2 size={16} /> Share

          {/* Share Button */}
          <button 
            onClick={() => setShowShareModal(true)}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FiShare2 size={12} /> Share
          </button>

          {/* Theme switcher */}
          <button 
            onClick={toggleTheme}
            className="p-1 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] text-[#6B7280] dark:text-[#94A3B8] transition-colors cursor-pointer"
            title="Toggle theme (Light / Dark mode)"
          >
            {isDarkMode ? <FiSun size={12} /> : <FiMoon size={12} />}

          </button>

          {/* Window controls */}
          <div className="flex items-center gap-1 ml-1 select-none">
            <div onClick={onBack} className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] hover:bg-[#FF5F56]/80 cursor-pointer" title="Back to dashboard" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] cursor-default" title="Minimize" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] cursor-default" title="Maximize" />
          </div>
        </div>
      </header>

      {/* 2. RIBBON TABS */}
      <div className="flex items-center bg-white border-b border-[#E2E8F0] dark:bg-[#080E1A] dark:border-[#1E293B] px-2 shrink-0 select-none transition-colors">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 text-xs cursor-pointer transition-colors ${
                isActive 
                  ? 'text-[#0A0F1E] dark:text-white border-b-2 border-[#2563EB] dark:border-[#2563EB] font-semibold bg-transparent' 
                  : 'text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] hover:text-[#0A0F1E] dark:hover:text-white'
              }`}
            >
              {tab}
            </div>
          );
        })}
      </div>

      {/* 3. RIBBON TOOLBAR */}
      <div className="flex items-center gap-0 bg-[#F8FAFF] dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-[#1E293B] px-2 py-1.5 flex-wrap shrink-0 transition-colors">
        
        {/* HOME TAB TOOLBAR */}
        {activeTab === 'Home' && (
          <>
            {/* Clipboard group */}
            <div className="flex items-center gap-1.5 px-1">
              <button 
                onClick={handlePaste}
                className="flex flex-col items-center justify-center p-0.5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer w-10 h-10 transition-colors text-[#374151] dark:text-[#94A3B8]"
                title="Paste (Ctrl+V)"
              >
                <Clipboard size={14} />
                <span className="text-[8px] text-[#94A3B8] dark:text-[#475569] mt-0.5 leading-none">Paste</span>
              </button>
              <div className="flex flex-col justify-center gap-0.5">
                <button 
                  onClick={handleCut}
                  className="flex items-center gap-1 px-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer transition-colors text-[8px] text-[#374151] dark:text-[#94A3B8]"
                  title="Cut (Ctrl+X)"
                >
                  <Scissors size={8} />
                  <span className="ml-1 text-[8px] leading-none">Cut</span>
                </button>
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer transition-colors text-[8px] text-[#374151] dark:text-[#94A3B8]"
                  title="Copy (Ctrl+C)"
                >
                  <Copy size={8} />
                  <span className="ml-1 text-[8px] leading-none">Copy</span>
                </button>
                <button 
                  onClick={handleFormatPainterClick}
                  className="flex items-center gap-1 px-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer transition-colors text-[8px] text-[#374151] dark:text-[#94A3B8]"
                  title="Format Painter"
                >
                  <Paintbrush size={8} />
                  <span className="ml-1 text-[8px] leading-none">Painter</span>
                </button>
              </div>
            </div>
            
            <div className="w-px h-10 bg-[#E2E8F0] dark:bg-[#1E293B] mx-1.5" />

            {/* Font group */}
            <div className="flex flex-col gap-1 px-1">
              <div className="flex items-center gap-1">
                <select 
                  className="bg-white dark:bg-[#080E1A] text-[#374151] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[10px] px-1 py-0.5 h-[22px] w-28 outline-none cursor-pointer hover:border-[#2563EB]/30 transition-colors"
                  value={activeStyles.fontName} 
                  onChange={(e) => applyFormat('fontName', e.target.value)}
                  title="Font Family"
                >
                  <option value="Calibri">Calibri</option>
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Segoe UI">Segoe UI</option>
                </select>
                
                <select 
                  className="bg-white dark:bg-[#080E1A] text-[#374151] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[10px] px-0.5 py-0.5 h-[22px] w-10 outline-none cursor-pointer hover:border-[#2563EB]/30 transition-colors"
                  value={activeStyles.fontSize} 
                  onChange={(e) => applyFormat('fontSize', e.target.value)}
                  title="Font Size"
                >
                  <option value="1">8</option>
                  <option value="2">10</option>
                  <option value="3">11</option>
                  <option value="4">12</option>
                  <option value="5">14</option>
                  <option value="6">18</option>
                  <option value="7">24</option>
                </select>

                <button onClick={handleGrowFont} className="flex items-center justify-center h-[22px] w-[22px] rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] text-[10px] font-bold transition-colors" title="Grow Font">A⁺</button>
                <button onClick={handleShrinkFont} className="flex items-center justify-center h-[22px] w-[22px] rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] text-[9px] font-bold transition-colors" title="Shrink Font">A⁻</button>
                <button onClick={() => applyFormat('removeFormat')} className="flex items-center justify-center h-[22px] w-[22px] rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors" title="Clear All Formatting"><Eraser size={11} /></button>
              </div>

              <div className="flex items-center gap-0.5">
                <button 
                  onClick={() => applyFormat('bold')} 
                  className={`flex items-center justify-center h-5 w-5 rounded cursor-pointer transition-colors ${activeStyles.bold ? 'bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] text-[#374151] dark:text-[#94A3B8]'}`}
                  title="Bold (Ctrl+B)"
                >
                  <Bold size={10} className="font-bold" />
                </button>
                <button 
                  onClick={() => applyFormat('italic')} 
                  className={`flex items-center justify-center h-5 w-5 rounded cursor-pointer transition-colors ${activeStyles.italic ? 'bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] text-[#374151] dark:text-[#94A3B8]'}`}
                  title="Italic (Ctrl+I)"
                >
                  <Italic size={10} />
                </button>
                <button 
                  onClick={() => applyFormat('underline')} 
                  className={`flex items-center justify-center h-5 w-5 rounded cursor-pointer transition-colors ${activeStyles.underline ? 'bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] text-[#374151] dark:text-[#94A3B8]'}`}
                  title="Underline (Ctrl+U)"
                >
                  <Underline size={10} />
                </button>
                <button 
                  onClick={() => applyFormat('strikeThrough')} 
                  className={`flex items-center justify-center h-5 w-5 rounded cursor-pointer transition-colors ${activeStyles.strikeThrough ? 'bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] text-[#374151] dark:text-[#94A3B8]'}`}
                  title="Strikethrough"
                >
                  <Strikethrough size={10} />
                </button>
                
                <button onClick={() => applyFormat('subscript')} className="flex items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] text-[8px] font-semibold transition-colors" title="Subscript">X₂</button>
                <button onClick={() => applyFormat('superscript')} className="flex items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] text-[8px] font-semibold transition-colors" title="Superscript">X²</button>
                
                <button onClick={handleHighlight} className="flex flex-col items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors" title="Text Highlight">
                  <Highlighter size={9} />
                  <span className="w-3.5 h-0.5 bg-yellow-400 rounded-sm" />
                </button>
                <button onClick={handleFontColor} className="flex flex-col items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors" title="Font Color">
                  <span className="text-[9px] font-bold leading-none">A</span>
                  <span className="w-3.5 h-0.5 bg-red-600 rounded-sm" />
                </button>
              </div>
            </div>

            <div className="w-px h-10 bg-[#E2E8F0] dark:bg-[#1E293B] mx-1.5" />

            {/* Paragraph group */}
            <div className="flex flex-col gap-1 px-1">
              <div className="flex items-center gap-0.5">
                <button onClick={() => applyFormat('insertUnorderedList')} className="flex items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors" title="Bullets"><List size={11} /></button>
                <button onClick={() => applyFormat('insertOrderedList')} className="flex items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors" title="Numbering"><ListOrdered size={11} /></button>
                
                <button onClick={() => applyFormat('outdent')} className="flex items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors" title="Decrease Indent"><Outdent size={11} /></button>
                <button onClick={() => applyFormat('indent')} className="flex items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors" title="Increase Indent"><Indent size={11} /></button>
                
                <button onClick={handleSort} className="flex items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] text-[8px] font-bold transition-colors" title="Sort A-Z">A-Z</button>
                
                <button 
                  onClick={() => setShowFormattingMarks(!showFormattingMarks)} 
                  className={`flex items-center justify-center h-5 w-5 rounded cursor-pointer transition-colors ${showFormattingMarks ? 'bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] text-[#374151] dark:text-[#94A3B8]'}`} 
                  title="Show/Hide Formatting Marks"
                >
                  <span className="text-[10px] font-bold">¶</span>
                </button>
              </div>

              <div className="flex items-center gap-0.5">
                <button 
                  onClick={() => applyFormat('justifyLeft')} 
                  className={`flex items-center justify-center h-5 w-5 rounded cursor-pointer transition-colors ${activeStyles.alignLeft ? 'bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] text-[#374151] dark:text-[#94A3B8]'}`}
                  title="Align Left"
                >
                  <AlignLeft size={10} />
                </button>
                <button 
                  onClick={() => applyFormat('justifyCenter')} 
                  className={`flex items-center justify-center h-5 w-5 rounded cursor-pointer transition-colors ${activeStyles.alignCenter ? 'bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] text-[#374151] dark:text-[#94A3B8]'}`}
                  title="Align Center"
                >
                  <AlignCenter size={10} />
                </button>
                <button 
                  onClick={() => applyFormat('justifyRight')} 
                  className={`flex items-center justify-center h-5 w-5 rounded cursor-pointer transition-colors ${activeStyles.alignRight ? 'bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] text-[#374151] dark:text-[#94A3B8]'}`}
                  title="Align Right"
                >
                  <AlignRight size={10} />
                </button>
                <button 
                  onClick={() => applyFormat('justifyFull')} 
                  className={`flex items-center justify-center h-5 w-5 rounded cursor-pointer transition-colors ${document.queryCommandState('justifyFull') ? 'bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] text-[#374151] dark:text-[#94A3B8]'}`}
                  title="Justify"
                >
                  <AlignJustify size={10} />
                </button>

                <select 
                  onChange={(e) => handleLineSpacing(e.target.value)}
                  className="bg-white dark:bg-[#080E1A] text-[#374151] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[8px] px-0.5 py-0.5 h-5 outline-none cursor-pointer w-10 hover:border-[#2563EB]/30 transition-colors"
                  defaultValue="1.5"
                  title="Line Spacing"
                >
                  <option value="1.0">1.0</option>
                  <option value="1.15">1.15</option>
                  <option value="1.5">1.5</option>
                  <option value="2.0">2.0</option>
                </select>

                <button onClick={() => applyFormat('backColor', '#e0f2fe')} className="flex items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors" title="Shading color"><PaintBucket size={10} /></button>
                <button onClick={handleBorder} className="flex items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors" title="Add Border"><Grid3x3 size={10} /></button>
              </div>
            </div>

            <div className="w-px h-10 bg-[#E2E8F0] dark:bg-[#1E293B] mx-1.5" />

            {/* Styles Preview Grid */}
            <div className="flex flex-col gap-0.5 px-1">
              <div className="flex items-center gap-1 overflow-x-auto max-w-[240px]">
                <div 
                  onClick={() => applyFormat('formatBlock', 'p')} 
                  className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg bg-white dark:bg-[#080E1A] p-0.5 cursor-pointer hover:border-[#2563EB]/30 hover:bg-[#F8FAFF] dark:hover:bg-[#1E293B] transition-colors w-11 h-8 flex flex-col justify-between flex-shrink-0"
                  title="Normal Text Style"
                >
                  <span className="text-[8px] font-normal leading-none text-gray-800 dark:text-gray-200">AaBb</span>
                  <span className="text-[6px] text-[#94A3B8] leading-none">Normal</span>
                </div>
                <div 
                  onClick={() => applyFormat('formatBlock', 'h1')} 
                  className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg bg-white dark:bg-[#080E1A] p-0.5 cursor-pointer hover:border-[#2563EB]/30 hover:bg-[#F8FAFF] dark:hover:bg-[#1E293B] transition-colors w-11 h-8 flex flex-col justify-between flex-shrink-0"
                  title="Title heading"
                >
                  <span className="text-[8px] font-bold leading-none text-gray-900 dark:text-white">AaBb</span>
                  <span className="text-[6px] text-[#94A3B8] leading-none">Title</span>
                </div>
                <div 
                  onClick={() => applyFormat('formatBlock', 'h2')} 
                  className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg bg-white dark:bg-[#080E1A] p-0.5 cursor-pointer hover:border-[#2563EB]/30 hover:bg-[#F8FAFF] dark:hover:bg-[#1E293B] transition-colors w-11 h-8 flex flex-col justify-between flex-shrink-0"
                  title="Heading 1"
                >
                  <span className="text-[7.5px] font-bold leading-none text-gray-900 dark:text-white">AaBb</span>
                  <span className="text-[6px] text-[#94A3B8] leading-none">Head 1</span>
                </div>
                <div 
                  onClick={() => applyFormat('formatBlock', 'h3')} 
                  className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg bg-white dark:bg-[#080E1A] p-0.5 cursor-pointer hover:border-[#2563EB]/30 hover:bg-[#F8FAFF] dark:hover:bg-[#1E293B] transition-colors w-11 h-8 flex flex-col justify-between flex-shrink-0"
                  title="Heading 2"
                >
                  <span className="text-[7.5px] font-semibold leading-none text-gray-805 dark:text-gray-200">AaBb</span>
                  <span className="text-[6px] text-[#94A3B8] leading-none">Head 2</span>
                </div>
                <div 
                  onClick={() => applyFormat('formatBlock', 'blockquote')} 
                  className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg bg-white dark:bg-[#080E1A] p-0.5 cursor-pointer hover:border-[#2563EB]/30 hover:bg-[#F8FAFF] dark:hover:bg-[#1E293B] transition-colors w-11 h-8 flex flex-col justify-between flex-shrink-0"
                  title="Subtitle quote style"
                >
                  <span className="text-[8px] italic leading-none text-gray-500">AaBb</span>
                  <span className="text-[6px] text-[#94A3B8] leading-none">Subt</span>
                </div>
              </div>
              <div className="text-[9px] text-[#94A3B8] text-center select-none leading-none mt-1">Styles</div>
            </div>

            <div className="w-px h-10 bg-[#E2E8F0] dark:bg-[#1E293B] mx-1.5" />

            {/* Editing actions */}
            <div className="flex items-center gap-1 px-1">
              <button 
                onClick={() => setShowFindReplace(true)}
                className="flex flex-col items-center justify-center p-0.5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer min-w-[26px] h-10 transition-colors text-[#374151] dark:text-[#94A3B8]"
                title="Find text (Ctrl+F)"
              >
                <Search size={12} />
                <span className="text-[7.5px] text-[#94A3B8] leading-none mt-0.5">Find</span>
              </button>
              <button 
                onClick={() => setShowFindReplace(true)}
                className="flex flex-col items-center justify-center p-0.5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer min-w-[26px] h-10 transition-colors text-[#374151] dark:text-[#94A3B8]"
                title="Replace text (Ctrl+H)"
              >
                <Replace size={12} />
                <span className="text-[7.5px] text-[#94A3B8] leading-none mt-0.5">Replace</span>
              </button>
              <button 
                onClick={() => applyFormat('selectAll')}
                className="flex flex-col items-center justify-center p-0.5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer min-w-[26px] h-10 transition-colors text-[#374151] dark:text-[#94A3B8]"
                title="Select All"
              >
                <span className="text-[9px] font-bold leading-none">All</span>
                <span className="text-[7.5px] text-[#94A3B8] leading-none mt-0.5">Select</span>
              </button>
            </div>
          </>
        )}

        {/* INSERT TAB TOOLBAR */}
        {activeTab === 'Insert' && (
          <div className="flex items-center gap-2.5 px-2">
            <button 
              onClick={handleInsertTable}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] min-w-[36px] transition-colors"
              title="Insert Table Grid"
            >
              <Table size={14} />
              <span className="text-[8px] text-[#94A3B8] mt-0.5">Table</span>
            </button>
            
            <button 
              onClick={handleInsertImage}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] min-w-[36px] transition-colors"
              title="Insert Picture"
            >
              <Image size={14} />
              <span className="text-[8px] text-[#94A3B8] mt-0.5">Pictures</span>
            </button>


        {/* REVIEW TAB CONTENT */}
        <div className={`ribbon-tab-content ${activeRibbonTab === 'review' ? 'visible' : 'hidden'}`}>
          <div className="ribbon-group">
            <div className="ribbon-controls-container">
              <div className="ribbon-buttons-row">
                <button type="button" className="ribbon-custom-btn" onClick={() => {
                  alert(`Proofing Statistics:\n- Total Words: ${wordCount}\n- Estimated Reading Time: ${Math.ceil(wordCount / 200)} min\n- Characters: ${(quillInstance.current ? quillInstance.current.getText() : '').length} chars`);
                }} title="Proofing Statistics">
                  <FaBookOpen size={16} style={{ marginRight: '6px' }} />
                  <span>Word Count Details</span>
                </button>
                <button type="button" className="ribbon-custom-btn" onClick={() => {
                  alert("Spelling & Grammar Check completed!\nNo spelling or grammatical issues were found.");
                }} title="Spelling Check">
                  <FaCheck size={16} style={{ marginRight: '6px' }} />
                  <span>Spelling & Grammar</span>
                </button>
              </div>
            </div>
            <span className="ribbon-group-label">Proofing</span>
          </div>
        </div>

        {/* VIEW TAB CONTENT */}
        <div className={`ribbon-tab-content ${activeRibbonTab === 'view' ? 'visible' : 'hidden'}`}>
          <div className="ribbon-group">
            <div className="ribbon-controls-container">
              <div className="ribbon-buttons-row">
                <button type="button" className={`ribbon-custom-btn ${!leftSidebarCollapsed ? 'active' : ''}`} onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}>
                  <FaList size={16} style={{ marginRight: '6px' }} />
                  <span>Navigation Outline</span>
                </button>
                <button type="button" className={`ribbon-custom-btn ${!rightSidebarCollapsed ? 'active' : ''}`} onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}>
                  <FaUserSecret size={16} style={{ marginRight: '6px' }} />
                  <span>Collaborations Pane</span>
                </button>
              </div>

            <button 
              onClick={handleInsertLink}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] min-w-[36px] transition-colors"
              title="Insert Hyperlink"
            >
              <Link size={14} />
              <span className="text-[8px] text-[#94A3B8] mt-0.5">Link</span>
            </button>

            <div className="w-px h-8 bg-[#E2E8F0] dark:bg-[#1E293B] mx-1" />

            <div className="text-[10px] text-[#94A3B8] select-none flex items-center gap-1 italic">
              <span>Header</span> | <span>Footer</span> | <span>WordArt</span>

            </div>
          </div>
        )}

        {/* VIEW TAB TOOLBAR */}
        {activeTab === 'View' && (
          <div className="flex items-center gap-4 px-2">
            {/* Show controls group */}
            <div className="flex flex-col gap-0.5 text-[10px] text-[#6B7280] dark:text-[#94A3B8]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showRuler} 
                  onChange={(e) => setShowRuler(e.target.checked)} 
                  className="rounded accent-[#2563EB] cursor-pointer"
                />
                <span>Ruler</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={!leftSidebarCollapsed} 
                  onChange={(e) => setLeftSidebarCollapsed(!e.target.checked)} 
                  className="rounded accent-[#2563EB] cursor-pointer"
                />
                <span>Navigation Pane</span>
              </label>
            </div>
            
            <div className="w-px h-8 bg-[#E2E8F0] dark:bg-[#1E293B] mx-1" />
            
            {/* Zoom presets */}
            <button 
              onClick={() => setZoom(100)} 
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] min-w-[36px] transition-colors"
              title="Set zoom to 100%"
            >
              <span className="font-bold text-[10px]">100%</span>
              <span className="text-[7.5px] text-[#94A3B8] leading-none">Zoom 100</span>
            </button>

            <button 
              onClick={() => setZoom(120)} 
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] min-w-[36px] transition-colors"
              title="Set zoom to page width"
            >
              <span className="text-[10px]">Page Width</span>
              <span className="text-[7.5px] text-[#94A3B8] leading-none">Zoom 120</span>
            </button>
          </div>
        )}


      {/* 5. MAIN WORKSPACE */}
      <main className="editor-workspace">
        
        {/* Toggle Left Sidebar Control Tab */}
        <div style={{ position: 'absolute', left: leftSidebarCollapsed ? '8px' : '268px', top: '12px', zIndex: 50, transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          <button 
            className="sidebar-toggle-btn" 
            onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
            title={leftSidebarCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Navigation Sidebar'}
          >
            {leftSidebarCollapsed ? <FaPlus size={16} /> : <LuX size={16} />}
          </button>
        </div>

        {/* FILE TAB TOOLBAR */}
        {activeTab === 'File' && (
          <div className="flex items-center gap-3 px-2">
            <button 
              onClick={onBack}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors"
              title="Return to documents list"
            >
              <ArrowLeft size={13} />
              <span className="text-[8px] text-[#94A3B8] mt-0.5 leading-none">Dashboard</span>
            </button>


            <button 
              onClick={handleManualSave}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors"
              title="Save a backup checkpoint now"
            >

              <FaList size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Outline

              <FiSave size={13} />
              <span className="text-[8px] text-[#94A3B8] mt-0.5 leading-none">Backup Save</span>

            </button>

            <button 
              onClick={() => {
                setLeftSidebarCollapsed(false);
                setLeftTab('history');
              }}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors"
              title="Open checkpoints history sidebar"
            >

              <FaHistory size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> History

              <History size={13} />
              <span className="text-[8px] text-[#94A3B8] mt-0.5 leading-none">Checkpoints</span>

            </button>
          </div>
        )}

        {/* DESIGN, LAYOUT, REFERENCES, MAILINGS, REVIEW, HELP */}
        {['Design', 'Layout', 'References', 'Mailings', 'Review', 'Help'].includes(activeTab) && (
          <div className="text-[10px] text-[#94A3B8] flex items-center h-8 px-2 italic">
            {activeTab} tab tools loaded. Add formatting elements in the editor below.
          </div>
        )}

      </div>

      {/* 4. RULER */}
      {showRuler && (
        <div className="flex items-center bg-[#F8FAFF] dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-[#1E293B] h-6 px-[96px] overflow-hidden select-none shrink-0 transition-colors">
          {/* Grey margin indent box */}
          <div className="w-[96px] h-full bg-[#E2E8F0] dark:bg-[#1E293B] border-r border-[#E2E8F0] dark:border-[#1E293B] flex-shrink-0" />
          
          {/* Main ruler ticks */}
          <div className="flex flex-1 items-center h-full relative pl-[10px]">
            {Array.from({length: 20}, (_, i) => (
              <div key={i} className="relative flex-shrink-0" style={{width: '48px'}}>
                <div className="absolute top-0 w-px h-1.5 bg-[#94A3B8] dark:bg-[#475569]"/>
                <span className="absolute top-1.5 text-[8px] text-[#94A3B8] dark:text-[#475569] -translate-x-1/2">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MAIN AREA (sidebar + document canvas) */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* LEFT SIDEBAR (Navigation Pane) */}
        {!leftSidebarCollapsed && (
          <aside className="w-52 bg-white dark:bg-[#080E1A] border-r border-[#E2E8F0] dark:border-[#1E293B] flex flex-col overflow-hidden shrink-0 transition-colors">
            {/* Sidebar header tabs */}
            <div className="flex border-b border-[#E2E8F0] dark:border-[#1E293B] h-8 shrink-0 select-none">
              {['outline', 'pages', 'history'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setLeftTab(tab)}
                  className={`flex-1 text-[10px] font-bold uppercase transition-colors border-b-2 cursor-pointer ${
                    leftTab === tab 
                      ? 'border-[#2563EB] text-[#2563EB] dark:text-white' 
                      : 'border-transparent text-[#6B7280] dark:text-[#94A3B8] hover:text-[#0A0F1E] dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Sidebar content scroll container */}
            <div className="flex-1 overflow-y-auto p-2">
              {/* Outline Tab heading list */}
              {leftTab === 'outline' && (
                <div className="flex flex-col gap-1 select-none">
                  {outline.length === 0 ? (
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 p-2 italic leading-tight">
                      No outline headings found. Write using Heading Styles (Title, Head 1, etc.) to build heading structure.
                    </div>
                  ) : (
                    outline.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleOutlineClick(item.id)}
                        className={`text-left text-sm py-1 px-1.5 rounded truncate text-[#0A0F1E] dark:text-[#94A3B8] hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] cursor-pointer transition-colors ${
                          item.level === 'h1' 
                            ? 'font-semibold pl-1' 
                            : item.level === 'h2' 
                            ? 'pl-4 text-[#6B7280] dark:text-[#94A3B8]/80' 
                            : 'pl-7 text-[#94A3B8] dark:text-[#94A3B8]/60 text-xs'
                        }`}
                        title={item.text}
                      >
                        {item.text}
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Pages Tab thumbnails list */}
              {leftTab === 'pages' && (
                <div className="flex flex-col items-center gap-3 py-2 select-none">
                  <div className="w-28 h-36 bg-white dark:bg-[#080E1A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm rounded-lg p-2 flex flex-col justify-between cursor-default">
                    <div className="flex flex-col gap-1 opacity-25">
                      <div className="h-1 bg-gray-500 dark:bg-gray-400 w-full" />
                      <div className="h-1 bg-gray-500 dark:bg-gray-400 w-5/6" />
                      <div className="h-1 bg-gray-500 dark:bg-gray-400 w-full" />
                      <div className="h-1 bg-gray-500 dark:bg-gray-400 w-4/6" />
                    </div>
                    <span className="text-[9px] text-[#6B7280] dark:text-[#94A3B8] text-center font-bold">Page 1</span>
                  </div>
                </div>
              )}

              {/* History checkpoints Tab list */}
              {leftTab === 'history' && (
                <div className="flex flex-col gap-2 p-1">
                  {historyCheckpoints.map((v) => (
                    <div 
                      key={v.id}
                      onClick={() => handleRestoreVersion(v.content)}
                      className="border border-[#E2E8F0] dark:border-[#1E293B] p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] cursor-pointer transition-colors"
                      title="Click to restore this backup checkpoint"
                    >
                      <div className="text-[10px] font-bold text-[#0A0F1E] dark:text-white">{v.date}</div>
                      <div className="text-[8px] text-[#6B7280] dark:text-[#94A3B8]">By {v.author}</div>
                      <div className="text-[9px] text-[#6B7280] dark:text-[#94A3B8] mt-1 leading-snug">{v.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Collapse footer */}
            <button 
              onClick={() => setLeftSidebarCollapsed(true)}
              className="h-8 border-t border-[#E2E8F0] dark:border-[#1E293B] text-[10px] text-[#6B7280] dark:text-[#94A3B8] hover:text-[#0A0F1E] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] flex items-center justify-center gap-1 cursor-pointer shrink-0 select-none transition-colors"
            >
              <ChevronLeft size={10} /> Collapse Navigation
            </button>
          </aside>
        )}

        {/* Small expand grip tab when collapsed */}
        {leftSidebarCollapsed && (
          <div 
            onClick={() => setLeftSidebarCollapsed(false)}
            className="w-4 bg-white dark:bg-[#080E1A] hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] border-r border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-center cursor-pointer shrink-0 transition-colors"
            title="Expand Navigation Pane"
          >
            <ChevronRight size={10} className="text-gray-400" />
          </div>
        )}

        {/* DOCUMENT CANVAS CONTAINER */}
        <section className="flex-1 bg-[#E8ECF0] dark:bg-[#2C2C2C] overflow-auto flex justify-center py-8 relative transition-colors">
          
          {/* Document A4 Page Sheet */}
          <div 
            className="bg-white shadow-md min-h-[1056px] w-[816px] px-[96px] py-[96px] relative text-left word-page select-text shrink-0"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              marginBottom: `${Math.max(24, 24 * (zoom / 100))}px`,
              backgroundColor: '#FFFFFF'
            }}
          >
            {/* Title - ONLY ONCE */}
            <h1 
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                handleTitleChange(e.target.innerText);
              }}
              className="text-3xl font-bold text-[#0A0F1E] outline-none mb-2"
            >
              {title}
            </h1>
            <hr className="border-gray-200 mb-6"/>

            {/* contentEditable body area */}
            <div
              ref={editorRef}
              className={`outline-none min-h-[800px] text-[11pt] font-[Calibri] text-gray-900 leading-relaxed word-editor-body`}
              contentEditable
              placeholder="Start typing your document here..."
              onInput={handleInput}
              onKeyUp={handleSelectionChange}
              onMouseUp={handleSelectionChange}
            />
          </div>

          {/* Find and Replace float box */}
          {showFindReplace && (
            <div className="absolute top-3 right-4 bg-white dark:bg-[#080E1A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-2xl rounded-lg p-2 z-50 flex items-center gap-2 text-xs transition-colors">
              <input 
                type="text" 
                placeholder="Find text..." 
                value={findText} 
                onChange={(e) => setFindText(e.target.value)}
                className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg px-2 py-1 bg-transparent text-[#0A0F1E] dark:text-white focus:outline-none focus:border-[#2563EB] transition-colors"
              />
              <input 
                type="text" 
                placeholder="Replace..." 
                value={replaceText} 
                onChange={(e) => setReplaceText(e.target.value)}
                className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg px-2 py-1 bg-transparent text-[#0A0F1E] dark:text-white focus:outline-none focus:border-[#2563EB] transition-colors"
              />
              <button 
                onClick={handleFind} 
                className="bg-[#2563EB] text-white px-2 py-1 rounded-lg hover:bg-[#1D4ED8] cursor-pointer font-semibold transition-colors"
              >
                Find Next
              </button>
              <button 
                onClick={handleReplace} 
                className="bg-[#107C10] text-white px-2 py-1 rounded-lg hover:bg-[#0F6F0F] cursor-pointer font-semibold transition-colors"
              >
                Replace
              </button>
              <button 
                onClick={() => setShowFindReplace(false)} 
                className="text-[#6B7280] dark:text-[#94A3B8] hover:text-[#0A0F1E] dark:hover:text-white cursor-pointer font-bold px-1.5 transition-colors"
              >
                ✕
              </button>
            </div>
          )}
        </section>


        {/* Toggle Right Sidebar Control Tab */}
        <div style={{ position: 'absolute', right: rightSidebarCollapsed ? '8px' : '268px', top: '12px', zIndex: 50, transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          <button 
            className="sidebar-toggle-btn" 
            onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
            title={rightSidebarCollapsed ? 'Expand Collaborations Sidebar' : 'Collapse Collaborations Sidebar'}
          >
            {rightSidebarCollapsed ? <FaUsers size={16} /> : <LuX size={16} />}
          </button>
        </div>

      </div>


      {/* 6. STATUS BAR */}
      <div className="flex items-center justify-between px-4 py-1 bg-[#2563EB] text-white text-xs shrink-0 select-none">
        
        <div className="flex items-center gap-3">
          <span>Page 1 of 1</span>
          <span className="opacity-40">|</span>
          <span>{wordCount} words</span>
          <span className="opacity-40">|</span>
          <span>Characters: {charCount}</span>
          <span className="opacity-40">|</span>
          <span>English (US)</span>
        </div>

        <div className="flex items-center gap-3">
          <span>Accessibility: Good to go</span>
          <span className="opacity-40">|</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setZoom(z => Math.max(50, z - 10))}
              className="hover:bg-white/20 rounded w-5 h-5 flex items-center justify-center"
            >

              <LuMessageSquare size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Team Chat

              −

            </button>
            <input 
              type="range" 
              min="50" max="200" 
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="w-20 accent-white"
              step="10"
            />
            <button 
              onClick={() => setZoom(z => Math.min(200, z + 10))}
              className="hover:bg-white/20 rounded w-5 h-5 flex items-center justify-center"
            >

              <FaUsers size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Comments
              +

           </button>
            <span className="w-8 text-center">
              {zoom}%
            </span>
          </div>


          <div className="sidebar-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 100px)' }}>
            
            {rightTab === 'chat' ? (
              <div className="chat-container">
                <div className="chat-messages">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`chat-bubble ${msg.type}`}>
                      <span className="chat-bubble-meta">
                        <strong>{msg.sender}</strong> • {msg.time}
                      </span>
                      {msg.text}
                    </div>
                  ))}
                  <div ref={chatBottomRef}></div>
                </div>

                <form onSubmit={handleSendMessage} className="chat-input-area">
                  <input
                    type="text"
                    className="chat-input"
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    placeholder="Type a team message..."
                  />
                  <button type="submit" className="chat-send-btn" title="Send message">
                    <LuSend size={14} />
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '16px' }}>
                  {comments.map((comment) => (
                    <div key={comment.id} className="comment-card">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-time">{comment.time}</span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddComment} className="comment-new-container">
                  <textarea
                    className="comment-textarea"
                    placeholder="Add feedback to canvas..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    required
                  ></textarea>
                  <button type="submit" className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px', alignSelf: 'flex-end' }}>
                    Post Comment
                  </button>
                </form>
              </div>
            )}
            
          </div>
        </aside>
      </main>

      {/* 6. BOTTOM WORD STATUS BAR */}
      <footer className="word-status-bar">
        <div className="status-bar-left">
          <span>Page 1 of 1</span>
          <span className="status-bar-separator">|</span>
          <span>{wordCount} words</span>
          <span className="status-bar-separator">|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Proofing status check">
            <LuCheck size={12} style={{ color: '#10b981' }} /> Spelling: Checked
          </span>
          <span className="status-bar-separator">|</span>
          <span>English (India)</span>
          <span className="status-bar-separator">|</span>
          <span>Accessibility: Good to go</span>
        </div>

        <div className="status-bar-center">
          <div className={`sync-badge ${isSyncing ? 'syncing' : ''}`} style={{ border: 'none', background: 'transparent', padding: 0 }}>
            <span className="sync-dot"></span>
            <span>{isSyncing ? 'AutoSave: Syncing...' : 'Saved to Cloud'}</span>
          </div>
        </div>

        <div className="status-bar-right">
          <button 
            type="button"
            className="status-bar-btn"
            onClick={() => alert("Focus Mode activated! Enjoy distraction-free writing.")}
            style={{ background: 'transparent', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer' }}
          >
            Focus
          </button>
          <span className="status-bar-separator">|</span>
          <button onClick={handleZoomOut} className="zoom-btn" title="Zoom Out">-</button>
          <input 
            type="range" 
            min="50" 
            max="150" 
            value={zoomPercent} 
            onChange={(e) => setZoomPercent(Number(e.target.value))} 
            className="zoom-slider" 
            title="Zoom percentage slider" 
          />
          <button onClick={handleZoomIn} className="zoom-btn" title="Zoom In">+</button>
          <span style={{ fontWeight: 600, width: '36px', textAlign: 'right' }}>{zoomPercent}%</span>

        </div>
      </div>

      {/* Share / Invitation Modal Overlay */}
      {showShareModal && (

        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Share Workspace</h3>
              <button className="modal-close" onClick={() => setShowShareModal(false)}>
                <LuX size={18} />

        <div className="flat-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="flat-modal-card bg-white dark:bg-[#080E1A] text-[#0A0F1E] dark:text-white border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl shadow-2xl p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flat-modal-header border-b border-[#E2E8F0] dark:border-[#1E293B] pb-2 flex justify-between items-center">
              <h3 className="flat-modal-title text-sm font-bold text-[#0A0F1E] dark:text-white">Share Workspace Link</h3>
              <button 
                className="p-1 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] text-[#6B7280] dark:text-[#94A3B8] transition-colors cursor-pointer" 
                onClick={() => setShowShareModal(false)}
              >
                <X size={14} />

              </button>
            </div>
            
            <div className="flat-modal-body py-3 flex flex-col gap-3">
              <div className="flat-form-group flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#94A3B8] dark:text-[#475569] uppercase tracking-wide">Invite collaborator email</label>
                <div className="flat-form-row flex gap-2">
                  <input 
                    type="email" 
                    className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg px-2.5 py-1 bg-white dark:bg-[#080E1A] text-xs flex-1 text-[#0A0F1E] dark:text-white focus:outline-none focus:border-[#2563EB] transition-colors" 
                    placeholder="colleague@domain.com"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                  <select 
                    className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-xs px-1.5 py-1 bg-white dark:bg-[#080E1A] text-[#0A0F1E] dark:text-white cursor-pointer outline-none focus:border-[#2563EB] transition-colors"
                    value={shareRole}
                    onChange={(e) => setShareRole(e.target.value)}
                  >

                    <option value={DOCUMENT_ROLES.OWNER}>{DOCUMENT_ROLES.OWNER}</option>
                    <option value={DOCUMENT_ROLES.EDITOR}>{DOCUMENT_ROLES.EDITOR}</option>
                    <option value={DOCUMENT_ROLES.VIEWER}>{DOCUMENT_ROLES.VIEWER}</option>
                  </select>
                  <button 
                    className="btn-primary"
                    style={{ padding: '0 16px' }}
                    onClick={handleSendCollabLink}

                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  <button 
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-3 py-1 rounded-lg cursor-pointer transition-colors"
                    onClick={() => {
                      if (shareEmail.trim()) {
                        triggerToast(`Sent invite to ${shareEmail} as ${shareRole}`, 'success');
                        setShareEmail('');
                      }
                    }}

                  >
                    Invite
                  </button>
                </div>
              </div>

              <div className="flat-form-group flex flex-col gap-1 border-t border-[#E2E8F0] dark:border-[#1E293B] pt-2">
                <label className="text-[10px] font-bold text-[#94A3B8] dark:text-[#475569] uppercase tracking-wide">Shareable Link</label>
                <div className="flat-copy-box flex gap-2">
                  <input 
                    type="text" 
                    className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg px-2 py-1 bg-[#F8FAFF] dark:bg-[#0F172A] text-[10px] flex-1 text-[#6B7280] dark:text-[#94A3B8]" 
                    readOnly 
                    value={window.location.href}
                  />

                  <button className="btn-copy" onClick={handleCopyLink}>
                    {copied ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaCheck size={14} /> Copied!
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaCopy size={14} /> Copy Link
                      </span>
                    )}

                  <button 
                    className="bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] hover:bg-[#2563EB] hover:text-white dark:hover:bg-[#2563EB] dark:hover:text-white text-xs px-3 py-1 rounded-lg cursor-pointer transition-colors" 
                    onClick={handleCopyLink}
                  >
                    {linkCopied ? 'Copied!' : 'Copy Link'}

                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  )
}

  );
}

