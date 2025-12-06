# AI Document Vault

The **AI Document Vault** is a prototype document management system designed to streamline the organization and understanding of text documents. It leverages the **Google Gemini API** to automatically generate concise summaries and clean, formatted Markdown versions of uploaded text files.

## 🚀 Features

- **Smart Upload**: Drag-and-drop interface for `.txt`, `.md`, and `.json` files.
- **AI Processing**: Automatically analyzes documents using Google Gemini (model: `gemini-2.5-flash`) to generate:
  - An executive summary.
  - Cleaned and standardized Markdown content.
- **Document Viewer**: A tabbed interface to toggle between the AI Summary, the Markdown version, and the raw original content.
- **Dual Storage Mode**: Supports both persistent storage via **Supabase** and a local in-memory fallback for quick testing without configuration.
- **Responsive UI**: Built with React and Tailwind CSS for a modern, clean aesthetic.

---

## 🛠️ Tech Stack

### Frontend (Client)

- **React**: UI Library (using Hooks).
- **Tailwind CSS**: Utility-first styling.
- **Lucide React**: Iconography.
- **React Markdown**: For rendering the AI-generated markdown.
- _Note_: The frontend uses ES Modules and `importmap` via CDN for a build-free local development experience.

### Backend (Server)

- **Node.js & Express**: API Server.
- **@google/genai**: Official SDK for Gemini API integration.
- **Multer**: Handling multipart/form-data file uploads.
- **Supabase (Optional)**: Database for persisting document metadata and content.

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- A Google Cloud Project with the Gemini API enabled (API Key).
- (Optional) A Supabase project for persistent storage.

### 1. Backend Setup

1.  Open a terminal in the project root.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up Environment Variables.

    - **Option A (Quick/Temporary)**: You can pass variables inline when running.
    - **Option B (.env)**: Create a `.env` file (if using `dotenv`, otherwise set in shell).

    Required variables:

    - `API_KEY`: Your Google Gemini API Key.

    Optional variables (for persistence):

    - `SUPABASE_URL`: Your Supabase Project URL.
    - `SUPABASE_KEY`: Your Supabase Service Role or Anon Key.

4.  Start the server:

    ```bash
    # Linux/Mac
    export API_KEY="your_actual_api_key_here"
    npm start

    # Windows (PowerShell)
    $env:API_KEY="your_actual_api_key_here"
    npm start
    ```

    The server will run on `http://localhost:3000`.

### 2. Frontend Setup

Since this project uses ES Modules directly in the browser (no Webpack/Vite build step required for this prototype):

1.  You simply need to serve the root directory over HTTP.
2.  You can use a simple static server like `serve` or VS Code's "Live Server" extension.

    ```bash
    npx serve .
    ```

3.  Open the URL provided (usually `http://localhost:3000` or `http://localhost:5000`).
    - _Note_: Ensure your frontend calls the backend on port 3000. If your static server runs on port 3000, you might need to adjust the backend port in `server/index.js` or the `API_URL` in `client/services/api.js`.

---

## 📂 Architecture Overview

The project is split into two distinct folders:

- **`client/`**: Contains all React components (`App.jsx`, `components/`, `services/`).
  - `api.js`: Handles communication with the backend. It includes a **Mock/Demo mode** that automatically activates if the backend is unreachable or if network requests fail, allowing the UI to be demonstrated purely in the browser.
- **`server/`**: Contains the Node.js application.
  - `index.js`: Express routes for `/upload`, `/documents`, etc.
  - `gemini.js`: Logic for interacting with the Google Gemini API.
  - `storage.js`: An abstraction layer that switches between Supabase (if configured) and an in-memory array (if not).

---

## 🧩 Design Choices & Assumptions

1.  **Browser ES Modules**: To minimize build complexity for this prototype, I utilized native ES Modules in the browser with an `importmap` in `index.html`. This allows React to run without a bundler like Webpack.
2.  **In-Memory Fallback**: To ensure the project is "runnable" immediately after downloading without needing a database setup, the backend defaults to storing data in a local JavaScript array if Supabase credentials are not provided.
3.  **Prompt Engineering**: The prompt in `server/gemini.js` is designed to ask for a JSON response containing specific keys (`summary`, `markdown`) to make frontend rendering deterministic.
4.  **File Types**: Currently restricted to text-based files (`.txt`, `.md`, `.json`) to keep the scope focused on text processing.

---

## 📝 Usage

1.  **Upload**: Click the "Select Files" button or drag a text file onto the drop zone.
2.  **Process**: The UI will show a "Processing" status while the backend uploads the file and waits for Gemini to analyze it.
3.  **View**: Click on a document card to open the detailed view.
4.  **Tabs**:
    - **AI Summary**: Read the high-level overview.
    - **Markdown**: View the cleaned-up version.
    - **Original**: Reference the raw text.

---

## ⚠️ Troubleshooting

- **"Backend not reachable (Demo Mode)"**: If you see this in the console, the frontend couldn't connect to `localhost:3000`. Ensure the Node server is running.
- **CORS Errors**: The backend is configured with `cors()`, but ensure you are accessing the frontend via `localhost` (not `127.0.0.1` mixed with `localhost`).
