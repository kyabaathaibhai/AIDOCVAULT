import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar.jsx';
import { DocumentList } from './components/DocumentList.jsx';
import { DocumentViewer } from './components/DocumentViewer.jsx';
import { apiService } from './services/api.js';
import { Upload, Loader2 } from 'lucide-react';

function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const docs = await apiService.getDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to load docs', err);
    } finally {
      setIsLoading(false);
    }
  };

  const processFile = async (file) => {
    // Optimistic UI update
    const tempId = 'temp-' + Date.now();
    const newDoc = {
      id: tempId,
      name: file.name,
      type: file.type,
      size: file.size,
      createdAt: Date.now(),
      status: 'processing',
      originalContent: 'Uploading...',
    };

    setDocuments((prev) => [newDoc, ...prev]);

    try {
      const savedDoc = await apiService.uploadDocument(file);
      setDocuments((prev) => prev.map((d) => (d.id === tempId ? savedDoc : d)));

      // If user is viewing this doc, update the view
      if (selectedDoc?.id === tempId) {
        setSelectedDoc(savedDoc);
      }
    } catch (error) {
      console.error('Upload/Processing failed', error);
      const errorDoc = {
        ...newDoc,
        status: 'error',
        error: 'Failed to process document.',
      };
      setDocuments((prev) => prev.map((d) => (d.id === tempId ? errorDoc : d)));
    }
  };

  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      setIsDragging(false);
      setUploadError(null);

      const files = Array.from(e.dataTransfer.files);
      const textFiles = files.filter(
        (f) =>
          f.type === 'text/plain' ||
          f.name.endsWith('.md') ||
          f.name.endsWith('.txt') ||
          f.name.endsWith('.json')
      );

      if (textFiles.length === 0) {
        setUploadError('Please upload text files (.txt, .md, .json).');
        return;
      }

      for (const file of textFiles) {
        await processFile(file);
      }
    },
    [selectedDoc]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = async (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      for (const file of files) {
        await processFile(file);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (selectedDoc?.id === id) setSelectedDoc(null);
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  return (
    <div className='flex h-screen bg-slate-50'>
      <Sidebar />

      <main className='flex-1 flex flex-col min-w-0 overflow-hidden relative'>
        <header className='bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm z-10'>
          <h1 className='text-2xl font-bold text-slate-800'>My Documents</h1>
        </header>

        <div
          className='flex-1 overflow-y-auto p-8 relative'
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isDragging && (
            <div className='absolute inset-0 bg-indigo-500/10 backdrop-blur-sm border-4 border-dashed border-indigo-500 z-50 flex items-center justify-center m-4 rounded-xl'>
              <div className='bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center'>
                <div className='bg-indigo-100 p-4 rounded-full mb-4 animate-bounce'>
                  <Upload size={48} className='text-indigo-600' />
                </div>
                <h3 className='text-xl font-bold text-slate-800'>
                  Drop files to upload
                </h3>
                <p className='text-slate-500'>
                  AI will automatically process them
                </p>
              </div>
            </div>
          )}

          {/* Enhanced Upload Area with Visual Drag & Drop Indicator */}
          <div className='mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden border-4 border-dashed border-white/30'>
            <div className='absolute top-0 right-0 p-8 opacity-10'>
              <Upload size={120} />
            </div>
            <div className='relative z-10 max-w-lg'>
              <h2 className='text-2xl font-bold mb-2 flex items-center'>
                <Upload className='mr-2' size={28} />
                Upload to Vault
              </h2>
              <p className='text-indigo-100 mb-6'>
                <strong>Drag & drop</strong> your text documents anywhere on
                this page, or click the button below. Our AI will summarize and
                format them instantly.
              </p>

              <div className='flex items-center space-x-4'>
                <label className='bg-white text-indigo-600 px-6 py-2.5 rounded-lg font-semibold cursor-pointer hover:bg-indigo-50 transition-colors shadow-sm inline-flex items-center'>
                  <Upload size={18} className='mr-2' />
                  Select Files
                  <input
                    type='file'
                    className='hidden'
                    multiple
                    accept='.txt,.md,.json,.docx'
                    onChange={handleFileInput}
                  />
                </label>
                {uploadError && (
                  <span className='text-red-200 bg-red-900/30 px-3 py-2 rounded-lg text-sm font-medium'>
                    {uploadError}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className='mb-6 flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-slate-700'>
              Recent Uploads
            </h3>
            <span className='text-sm text-slate-500 flex items-center bg-slate-200 px-3 py-1.5 rounded-full'>
              <Upload size={14} className='mr-1.5' />
              Drop files anywhere to upload
            </span>
          </div>

          {isLoading ? (
            <div className='flex justify-center items-center h-48'>
              <Loader2 className='animate-spin text-indigo-600' size={32} />
            </div>
          ) : documents.length === 0 ? (
            <div className='border-4 border-dashed border-slate-300 rounded-2xl p-16 text-center bg-white hover:border-indigo-400 hover:bg-indigo-50/30 transition-all'>
              <div className='bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Upload size={40} className='text-slate-400' />
              </div>
              <h3 className='text-xl font-semibold text-slate-700 mb-2'>
                No documents yet
              </h3>
              <p className='text-slate-500 mb-4'>
                Drag and drop files here or use the upload button above
              </p>
              <p className='text-xs text-slate-400'>
                Supported formats: .txt, .md, .json
              </p>
            </div>
          ) : (
            <DocumentList
              documents={documents}
              onSelect={setSelectedDoc}
              selectedId={selectedDoc?.id}
            />
          )}
        </div>
      </main>

      {selectedDoc && (
        <DocumentViewer
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;
