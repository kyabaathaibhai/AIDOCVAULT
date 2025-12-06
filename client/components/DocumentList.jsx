import React from 'react';
import {
  File,
  FileText,
  FileCode,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
  MoreVertical,
} from 'lucide-react';

export const DocumentList = ({ documents, onSelect, selectedId }) => {
  // Get appropriate icon based on file extension
  const getFileIcon = (fileName) => {
    if (!fileName) return File;

    const extension = fileName.toLowerCase().split('.').pop();

    switch (extension) {
      case 'md':
        return FileCode; // Markdown files
      case 'docx':
        return FileText; // Word documents
      case 'txt':
        return FileText; // Text files
      case 'json':
        return FileCode; // JSON files
      default:
        return File; // Default icon
    }
  };

  if (documents.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50'>
        <File size={48} className='mb-4 text-slate-300' />
        <p className='text-lg font-medium text-slate-600'>No documents yet</p>
        <p className='text-sm'>Upload a text file to get started</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {documents.map((doc) => (
        <div
          key={doc.id}
          onClick={() => onSelect(doc)}
          className={`group relative p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
            selectedId === doc.id
              ? 'bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-500/20'
              : 'bg-white border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className='flex justify-between items-start mb-3'>
            <div
              className={`p-2.5 rounded-lg ${
                doc.status === 'completed'
                  ? 'bg-indigo-100 text-indigo-600'
                  : doc.status === 'processing'
                  ? 'bg-amber-100 text-amber-600'
                  : doc.status === 'error'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {doc.status === 'processing' ? (
                <Loader2 size={20} className='animate-spin' />
              ) : (
                React.createElement(getFileIcon(doc.name), { size: 20 })
              )}
            </div>
            <button className='text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100'>
              <MoreVertical size={16} />
            </button>
          </div>

          <h3
            className='font-semibold text-slate-900 truncate mb-1'
            title={doc.name}
          >
            {doc.name}
          </h3>

          <div className='flex items-center text-xs text-slate-500 space-x-2 mb-3'>
            <span>{doc.size ? (doc.size / 1024).toFixed(1) : 0} KB</span>
            <span>•</span>
            <span className='flex items-center'>
              <Clock size={10} className='mr-1' />
              {new Date(doc.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className='flex items-center justify-between pt-3 border-t border-slate-100'>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                doc.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : doc.status === 'processing'
                  ? 'bg-amber-100 text-amber-700'
                  : doc.status === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {doc.status === 'completed' && (
                <CheckCircle size={10} className='mr-1' />
              )}
              {doc.status === 'processing' && (
                <Loader2 size={10} className='mr-1 animate-spin' />
              )}
              {doc.status === 'error' && (
                <AlertCircle size={10} className='mr-1' />
              )}
              {doc.status
                ? doc.status.charAt(0).toUpperCase() + doc.status.slice(1)
                : 'Unknown'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
