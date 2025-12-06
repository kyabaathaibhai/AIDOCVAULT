import React, { useState, useMemo } from 'react';
import {
  FileText,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Clock,
  MoreVertical,
  Search,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';

export const FileExplorer = ({ documents, onSelect, selectedId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));

  // Filter documents by search query
  const filteredDocs = useMemo(() => {
    if (!searchQuery) return documents;
    return documents.filter((doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [documents, searchQuery]);

  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const renderDocument = (doc) => {
    const isSelected = selectedId === doc.id;

    return (
      <div
        key={doc.id}
        className={`group flex items-center py-2 px-4 hover:bg-indigo-50 cursor-pointer transition-colors ${
          isSelected ? 'bg-indigo-100 border-l-2 border-indigo-500' : ''
        }`}
        style={{ paddingLeft: '32px' }}
        onClick={() => onSelect(doc)}
      >
        <div className='flex items-center flex-1 min-w-0'>
          <div
            className={`mr-3 flex-shrink-0 ${
              doc.status === 'completed'
                ? 'text-indigo-600'
                : doc.status === 'processing'
                ? 'text-amber-600'
                : doc.status === 'error'
                ? 'text-red-600'
                : 'text-slate-600'
            }`}
          >
            {doc.status === 'processing' ? (
              <Loader2 size={18} className='animate-spin' />
            ) : (
              <FileText size={18} />
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <div className='font-medium text-slate-900 truncate'>
              {doc.name}
            </div>
            <div className='flex items-center text-xs text-slate-500 space-x-2 mt-0.5'>
              <span>{doc.size ? (doc.size / 1024).toFixed(1) : 0} KB</span>
              <span>•</span>
              <span className='flex items-center'>
                <Clock size={10} className='mr-1' />
                {new Date(doc.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className='ml-2 flex items-center space-x-2'>
          {doc.status === 'completed' && (
            <CheckCircle size={14} className='text-green-500' />
          )}
          {doc.status === 'error' && (
            <AlertCircle size={14} className='text-red-500' />
          )}
          <button className='opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded transition-opacity'>
            <MoreVertical size={14} className='text-slate-500' />
          </button>
        </div>
      </div>
    );
  };

  if (documents.length === 0 && !searchQuery) {
    return (
      <div className='flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50'>
        <Folder size={48} className='mb-4 text-slate-300' />
        <p className='text-lg font-medium text-slate-600'>No documents yet</p>
        <p className='text-sm'>Upload a text file to get started</p>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
      {/* Toolbar */}
      <div className='border-b border-slate-200 bg-slate-50 px-4 py-3'>
        <div className='relative max-w-md'>
          <Search
            size={16}
            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400'
          />
          <input
            type='text'
            placeholder='Search documents...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm'
          />
        </div>
      </div>

      {/* File Tree */}
      <div
        className='overflow-y-auto'
        style={{ maxHeight: 'calc(100vh - 400px)' }}
      >
        {/* All Documents Folder */}
        <div>
          <div
            className={`flex items-center py-2 px-3 hover:bg-slate-100 cursor-pointer transition-colors ${
              expandedFolders.has('root') ? 'bg-slate-50' : ''
            }`}
            onClick={() => toggleFolder('root')}
          >
            <div className='flex items-center flex-1 min-w-0'>
              {expandedFolders.has('root') ? (
                <ChevronDown
                  size={16}
                  className='text-slate-500 mr-2 flex-shrink-0'
                />
              ) : (
                <ChevronRight
                  size={16}
                  className='text-slate-500 mr-2 flex-shrink-0'
                />
              )}
              {expandedFolders.has('root') ? (
                <FolderOpen
                  size={18}
                  className='text-amber-500 mr-2 flex-shrink-0'
                />
              ) : (
                <Folder
                  size={18}
                  className='text-amber-500 mr-2 flex-shrink-0'
                />
              )}
              <span className='font-medium text-slate-700 truncate'>
                All Documents
              </span>
              <span className='ml-2 text-xs text-slate-400'>
                ({filteredDocs.length})
              </span>
            </div>
          </div>
          {expandedFolders.has('root') && (
            <div>
              {filteredDocs.length === 0 ? (
                <div
                  className='text-sm text-slate-400 py-2 px-3'
                  style={{ paddingLeft: '32px' }}
                >
                  {searchQuery
                    ? `No documents found matching "${searchQuery}"`
                    : 'Empty folder'}
                </div>
              ) : (
                filteredDocs.map((doc) => renderDocument(doc))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
