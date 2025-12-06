# AI Document Vault

The **AI Document Vault** is a modern document management system that leverages Google Gemini AI to automatically process, summarize, and organize text documents. It provides an intuitive file explorer interface for navigating uploaded documents with AI-powered insights.

## 🚀 Features

- **Smart Upload**: Drag-and-drop interface for `.txt`, `.md`, `.json`, and `.docx` files
- **AI Processing**: Automatically analyzes documents using Google Gemini API to generate:
  - Executive summaries
  - Cleaned and standardized Markdown content
- **File Explorer View**: Tree-style navigation with expandable "All Documents" folder
- **Document Viewer**: Tabbed interface to toggle between AI Summary, Markdown, and Original content
- **Search Functionality**: Real-time search to filter documents by name
- **Dual Storage Mode**: Supports persistent storage via Supabase or local in-memory fallback
- **Responsive UI**: Modern, clean interface built with React and Tailwind CSS
- **Status Tracking**: Visual indicators for document processing status (processing, completed, error)

---

## 🛠️ Tech Stack

### Frontend (Client)

- **React 19**: UI library with modern hooks
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Markdown**: For rendering AI-generated markdown content

### Backend (Server)

- **Node.js & Express**: RESTful API server
- **@google/genai**: Official SDK for Gemini API integration
- **Multer**: Multipart/form-data file upload handling
- **Mammoth**: DOCX file parsing
- **Supabase (Optional)**: PostgreSQL database for persistent storage
- **dotenv**: Environment variable management

---

## ⚙️ Setup & Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))
- **(Optional) Supabase Account** for persistent storage

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd DOCVAULT
```

### Step 2: Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `server/` directory:

   ```bash
   touch .env
   ```

4. Add your environment variables to `.env`:

   ```env
   # Required: Google Gemini API Key
   API_KEY=your_gemini_api_key_here

   # Optional: Supabase Configuration (for persistent storage)
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_service_role_key
   ```

5. **(Optional)** If using Supabase, run the migration:

   ```bash
   # Connect to your Supabase project and run the SQL from migration.sql
   # Or use the Supabase dashboard to execute the migration.sql file
   ```

6. Start the backend server:

   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

   The server will run on `http://localhost:3000`

### Step 3: Frontend Setup

1. Open a **new terminal** and navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (Vite's default port)

   > **Note**: If you encounter a port conflict, Vite will automatically use the next available port (e.g., 5174). Check the terminal output for the actual URL.

### Step 4: Access the Application

1. Open your browser and navigate to the frontend URL (typically `http://localhost:5173`)
2. Ensure the backend server is running on port 3000
3. Start uploading documents!

---

## 📂 Project Structure

```
DOCVAULT/
├── client/                 # Frontend React application
│   ├── components/        # React components
│   │   ├── FileExplorer.jsx    # File explorer view with folder navigation
│   │   ├── DocumentList.jsx     # Document grid view (legacy)
│   │   ├── DocumentViewer.jsx   # Document detail viewer
│   │   └── Sidebar.jsx          # Sidebar navigation
│   ├── services/
│   │   └── api.js         # API service layer
│   ├── App.jsx            # Main application component
│   ├── index.jsx          # Application entry point
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
│
├── server/                # Backend Express application
│   ├── index.js          # Express server and routes
│   ├── gemini.js          # Gemini API integration
│   ├── storage.js         # Storage abstraction (Supabase/in-memory)
│   ├── migration.sql      # Database schema
│   └── package.json       # Backend dependencies
│
└── README.md             # This file
```

---

## 🏗️ Architecture Overview

### System Architecture

The application follows a **client-server architecture** with clear separation of concerns:

1. **Frontend (Client)**: React SPA that handles UI/UX and communicates with the backend via REST API
2. **Backend (Server)**: Express.js API server that processes files and integrates with Gemini AI
3. **Storage Layer**: Abstraction that supports both Supabase (persistent) and in-memory (development) storage

### Data Flow

```
User Upload → Frontend (React) → Backend API (Express) → Gemini AI → Storage → Response → Frontend Display
```

### Key Components

#### Frontend Components

- **FileExplorer**: Main document navigation component with tree view

  - Displays documents in an expandable folder structure
  - Provides search functionality
  - Shows document metadata (size, date, status)

- **DocumentViewer**: Modal component for viewing document details

  - Three-tab interface (AI Summary, Markdown, Original)
  - Document deletion functionality

- **App**: Main application orchestrator
  - Manages document state
  - Handles file uploads (drag-and-drop and file input)
  - Coordinates between components

#### Backend Services

- **index.js**: Express server with REST endpoints

  - `GET /api/documents`: Fetch all documents
  - `POST /api/upload`: Upload and process documents
  - `DELETE /api/documents/:id`: Delete a document

- **gemini.js**: AI processing service

  - Sends document content to Gemini API
  - Parses JSON response for summary and markdown

- **storage.js**: Storage abstraction layer
  - Automatically switches between Supabase and in-memory storage
  - Provides consistent API regardless of storage backend

---

## 🎨 Design Choices & Architecture Decisions

### 1. **File Explorer Interface**

**Choice**: Implemented a file explorer view instead of a simple grid/list.

**Rationale**:

- Provides better organization for large numbers of documents
- Familiar interface pattern (similar to file managers)
- Allows for future folder organization features
- Better scalability as document count grows

**Implementation**:

- Tree structure with expandable "All Documents" folder
- Indented document list for visual hierarchy
- Search integrated into the explorer toolbar

### 2. **Dual Storage Mode**

**Choice**: Support both Supabase (persistent) and in-memory (development) storage.

**Rationale**:

- Allows immediate testing without database setup
- Graceful degradation for development
- Easy migration path to production
- Reduces setup friction for new developers

**Implementation**:

- Storage service checks for Supabase credentials
- Falls back to in-memory array if credentials missing
- Same API interface for both modes

### 3. **Vite for Frontend Build**

**Choice**: Use Vite instead of Create React App or plain ES modules.

**Rationale**:

- Faster development server and HMR
- Modern build tool with excellent React support
- Better developer experience
- Production-ready build optimization

### 4. **Component-Based Architecture**

**Choice**: Modular React components with clear separation.

**Rationale**:

- Reusability and maintainability
- Easier testing and debugging
- Clear component responsibilities
- Follows React best practices

### 5. **Status-Based UI Feedback**

**Choice**: Visual status indicators (processing, completed, error).

**Rationale**:

- Clear user feedback during async operations
- Better UX for long-running AI processing
- Helps users understand system state

---

## 🔧 Assumptions Made

1. **File Size Limit**: Maximum file size of 5MB (configurable in `server/index.js`)

   - Assumes reasonable document sizes for text processing
   - Larger files may require chunking or streaming

2. **Supported File Types**: `.txt`, `.md`, `.json`, `.docx`

   - Focuses on text-based documents
   - Binary files are base64 encoded but not processed by AI

3. **API Response Format**: Gemini API returns JSON with `summary` and `markdown` keys

   - Prompt engineering assumes specific response structure
   - Error handling for malformed responses is minimal

4. **Single User**: No authentication or user management

   - All documents are shared in a single namespace
   - Suitable for personal or single-user scenarios

5. **Local Development**: Default setup assumes local development

   - Backend runs on `localhost:3000`
   - Frontend configured to connect to local backend
   - CORS enabled for local development

6. **Browser Support**: Modern browsers with ES6+ support

   - Uses modern JavaScript features
   - No polyfills for older browsers

7. **Network Stability**: Assumes stable network connection
   - No offline mode or retry logic
   - Upload failures require manual retry

---

## 📝 Usage Guide

### Uploading Documents

1. **Drag & Drop**: Simply drag files onto the page anywhere
2. **File Input**: Click "Select Files" button in the upload area
3. **Supported Formats**: `.txt`, `.md`, `.json`, `.docx`

### Viewing Documents

1. **Browse**: Use the file explorer to see all documents
2. **Search**: Type in the search bar to filter documents
3. **Select**: Click on any document to view details
4. **Tabs**: Switch between AI Summary, Markdown, and Original views

### Managing Documents

- **Delete**: Use the delete button in the document viewer
- **Status**: Check document status indicators (processing, completed, error)

---

## ⚠️ Troubleshooting

### Backend Issues

**Problem**: Server won't start

- **Solution**: Check that port 3000 is not in use
- **Solution**: Verify `.env` file exists and contains `API_KEY`

**Problem**: "Failed to fetch documents" error

- **Solution**: Ensure backend server is running on port 3000
- **Solution**: Check CORS configuration in `server/index.js`

**Problem**: Gemini API errors

- **Solution**: Verify API key is correct and has quota remaining
- **Solution**: Check API key permissions in Google Cloud Console

### Frontend Issues

**Problem**: Frontend can't connect to backend

- **Solution**: Verify backend is running on `http://localhost:3000`
- **Solution**: Check `client/services/api.js` has correct `API_URL`
- **Solution**: Ensure no CORS errors in browser console

**Problem**: Port conflict (port already in use)

- **Solution**: Vite will auto-select next available port
- **Solution**: Or change port in `client/vite.config.js`

**Problem**: Documents not appearing

- **Solution**: Check browser console for errors
- **Solution**: Verify backend is processing uploads successfully
- **Solution**: Check network tab for failed API requests

### Storage Issues

**Problem**: Documents disappear after server restart

- **Solution**: This is expected with in-memory storage
- **Solution**: Set up Supabase for persistent storage

**Problem**: Supabase connection errors

- **Solution**: Verify `SUPABASE_URL` and `SUPABASE_KEY` in `.env`
- **Solution**: Ensure migration.sql has been executed
- **Solution**: Check Supabase project is active

---

## 📄 License

This project is a prototype/demo application. Please check with the repository owner for licensing information.

---

## 🤝 Contributing

This is a demonstration project. For contributions, please follow standard Git workflow:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📧 Support

For issues or questions, please check:

- Browser console for frontend errors
- Server terminal for backend errors
- Network tab for API request/response details

---

**Built with ❤️ using React, Express, and Google Gemini AI**
