// API Service to talk to the backend

// If you are running the backend locally, it will likely be on port 3000.
// This assumes the frontend is proxied or CORS is enabled.
const API_URL = 'http://localhost:3000/api';

export const apiService = {
  async getDocuments() {
    try {
      const response = await fetch(`${API_URL}/documents`);
      if (!response.ok) throw new Error('Failed to fetch documents');
      return await response.json();
    } catch (e) {
      console.error("Backend not reachable, returning empty list", e);
      return []; 
    }
  },

  async uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  },

  async deleteDocument(id) {
    const response = await fetch(`${API_URL}/documents/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Delete failed');
    }
    
    return true;
  }
};
