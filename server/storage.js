import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Check for Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const hasSupabase = supabaseUrl && supabaseKey;

let supabase = null;
if (hasSupabase) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.log("Supabase credentials missing. Using local in-memory storage.");
}

// In-memory fallback
let localDocuments = [];

export const storageService = {
  async getAllDocuments() {
    if (hasSupabase) {
      const { data, error } = await supabase
        .from('documents')
        .select('*');
      if (error) throw error;
      return data;
    }
    return [...localDocuments];
  },

  async saveDocument(doc) {
    const docWithId = { ...doc, id: doc.id || uuidv4() };

    if (hasSupabase) {
      const { data, error } = await supabase
        .from('documents')
        .insert([docWithId])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    localDocuments.push(docWithId);
    return docWithId;
  },

  async updateDocument(id, updates) {
    if (hasSupabase) {
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const index = localDocuments.findIndex(d => d.id === id);
    if (index !== -1) {
      localDocuments[index] = { ...localDocuments[index], ...updates };
      return localDocuments[index];
    }
    return null;
  },

  async deleteDocument(id) {
    if (hasSupabase) {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }

    localDocuments = localDocuments.filter(d => d.id !== id);
  }
};
