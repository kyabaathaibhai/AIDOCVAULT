import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { X, FileText, Sparkles, Download, Copy, RefreshCw, Loader2, Trash2 } from 'lucide-react';

export const DocumentViewer = ({ document, onClose, onDelete }) => {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{document.name}</h2>
              <p className="text-sm text-slate-500 flex items-center">
                Last edited {new Date(document.createdAt).toLocaleString()} 
                <span className="mx-2">•</span>
                {document.size ? (document.size / 1024).toFixed(2) : 0} KB
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onDelete(document.id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete Document"
            >
              <Trash2 size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-slate-200 bg-slate-50/50 flex space-x-6">
          <TabButton 
            active={activeTab === 'summary'} 
            onClick={() => setActiveTab('summary')}
            icon={<Sparkles size={16} className={activeTab === 'summary' ? "text-amber-500" : ""} />}
            label="AI Summary"
          />
          <TabButton 
            active={activeTab === 'markdown'} 
            onClick={() => setActiveTab('markdown')}
            icon={<FileText size={16} />}
            label="Markdown"
          />
          <TabButton 
            active={activeTab === 'original'} 
            onClick={() => setActiveTab('original')}
            icon={<FileText size={16} />}
            label="Original Content"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/30 p-8">
          <div className="max-w-4xl mx-auto bg-white min-h-full shadow-sm rounded-xl border border-slate-200 p-8 md:p-12">
            
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-slate-100">
                    <Sparkles className="text-amber-500" size={24} />
                    <h3 className="text-lg font-semibold text-slate-800">Executive Summary</h3>
                </div>
                {document.status === 'processing' ? (
                  <ProcessingState />
                ) : document.summary ? (
                  <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-700 leading-relaxed font-medium">
                      {document.summary}
                    </p>
                  </div>
                ) : (
                  <EmptyState message="Summary not available." />
                )}
              </div>
            )}

            {activeTab === 'markdown' && (
              <div className="relative group">
                {document.status === 'completed' && (
                   <div className="absolute top-0 right-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-2 text-slate-400 hover:text-indigo-600 border rounded-md bg-white shadow-sm" title="Copy Markdown">
                       <Copy size={16} />
                     </button>
                     <button className="p-2 text-slate-400 hover:text-indigo-600 border rounded-md bg-white shadow-sm" title="Download">
                       <Download size={16} />
                     </button>
                   </div>
                )}
                
                {document.status === 'processing' ? (
                  <ProcessingState />
                ) : document.markdown ? (
                  <article className="prose prose-slate prose-headings:font-bold prose-headings:text-slate-800 prose-a:text-indigo-600 max-w-none">
                    <ReactMarkdown>{document.markdown}</ReactMarkdown>
                  </article>
                ) : (
                  <EmptyState message="Markdown content not available." />
                )}
              </div>
            )}

            {activeTab === 'original' && (
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Raw Content</h3>
                <pre className="whitespace-pre-wrap font-mono text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200 overflow-x-auto">
                  {document.originalContent || "No content found."}
                </pre>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`pb-3 flex items-center space-x-2 text-sm font-medium transition-colors relative ${
      active ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
    }`}
  >
    {icon}
    <span>{label}</span>
    {active && (
      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
    )}
  </button>
);

const ProcessingState = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 text-slate-400">
        <Loader2 size={48} className="animate-spin text-indigo-500" />
        <p className="text-slate-600 font-medium animate-pulse">AI is analyzing document...</p>
    </div>
)

const EmptyState = ({ message }) => (
    <div className="text-center py-12 text-slate-400">
        <p>{message}</p>
    </div>
)
