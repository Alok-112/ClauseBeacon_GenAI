
# 🌟 ClauseBeacon: Your AI Legal Navigator 🌟

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-8E75B9?style=for-the-badge&logo=google&logoColor=white)](https://ai.google/gemini/)

**ClauseBeacon illuminates the complexities of legal documents, transforming dense contracts and agreements into clear, actionable insights.**

---

## 🚀 The Vision

In a world filled with contracts, terms of service, and legal agreements, the average person is often left in the dark. Legal jargon is intimidating, time-consuming to decipher, and fraught with hidden risks. This information asymmetry puts individuals and small businesses at a significant disadvantage.

**ClauseBeacon is our answer.** We believe everyone has the right to understand the documents they sign. Our mission is to democratize legal comprehension by leveraging the power of generative AI, making legal documents accessible, understandable, and manageable for all.

---

## ✨ Key Features

ClauseBeacon is more than just a document reader; it's a comprehensive analysis and interaction platform.

| Feature                      | Description                                                                                                                              | Icon        |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **Seamless Document Upload** | Upload your documents in various formats (`.pdf`, `.png`, `.jpeg`, `.txt`). Our powerful OCR engine extracts the text in seconds.          | 📄          |
| **AI-Powered Summary**       | Instantly get a concise, easy-to-understand summary of the document's key points, formatted with headings and bullet points for clarity. | ✍️          |
| **Risk Factor Identification** | Our AI scans for onerous clauses, potential risks, and disadvantageous terms, highlighting them so you know exactly where to focus.    | ⚠️          |
| **Actionable Checklist**     | Receive a personalized, auto-generated checklist of actions you should consider, such as points to clarify or terms to renegotiate.      | ✅          |
| **Interactive Q&A**          | Ask specific questions about your document in plain English or Hinglish and get instant answers from our AI legal assistant.              | 💬          |
| **Multilingual Translation** | Translate the entire analysis into numerous languages, including Hindi, Spanish, French, and more, breaking down language barriers.      | 🌐          |
| **Text-to-Speech**           | Listen to summaries and simplified clause explanations, making the content accessible even on the go.                                    | 🗣️          |
| **PDF Report Generation**    | Download a clean, professional, and beautifully formatted PDF report of the complete analysis to share or save for your records.         | 📥          |
| **Modern, Responsive UI**    | A sleek, intuitive interface with a stunning dark mode, built for a seamless experience on any device.                                 | 🎨          |

---

## 🛠️ Technology Stack

ClauseBeacon is built on a foundation of modern, scalable, and powerful technologies.

- **Frontend**:
  - **Framework**: [Next.js](https://nextjs.org/) (App Router) & [React](https://reactjs.org/)
  - **UI**: [ShadCN UI](https://ui.shadcn.com/) & [Tailwind CSS](https://tailwindcss.com/)
  - **Language**: [TypeScript](https://www.typescriptlang.org/)

- **Backend & AI**:
  - **AI Framework**: [Google's Genkit](https://firebase.google.com/docs/genkit)
  - **AI Model**: [Google Gemini 2.5 Flash](https://ai.google/gemini/) for analysis, translation, and Q&A.
  - **Server Actions**: Secure and efficient communication between the client and server.

- **Deployment**:  
  - **Hosting**: [Vercel](https://vercel.com/) for seamless, scalable, and developer-friendly deployment.  


---

## 🏃‍♀️ Running a Local Instance

Want to see ClauseBeacon in action on your own machine? Follow these steps.

### Prerequisites

1.  **Node.js**: Ensure you have Node.js version 20 or later installed.
2.  **Google AI API Key**: You must have an active [Google AI Gemini API Key](https://ai.google.dev/).
3.  **Git**: You need Git to clone the repository.

### Setup Instructions

1.  **Clone the Repository**:
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**:
    -   Create a new file named `.env.local` in the root of your project.
    -   Add your Gemini API key to this file:
        ```
        GEMINI_API_KEY=your_api_key_here
        ```

4.  **Run the Development Servers**:
    ClauseBeacon requires two separate processes to run concurrently.

    -   **Terminal 1: Start the Genkit AI Server**
        ```bash
        npm run genkit:dev
        ```
        This launches the AI flows and makes them available to the application.

    -   **Terminal 2: Start the Next.js Frontend Server**
        ```bash
        npm run dev
        ```

5.  **Launch the App**:
    Open your browser and navigate to [http://localhost:9002](http://localhost:9002). You should now see the ClauseBeacon application running locally!

---

## 🏆 Our Commitment

ClauseBeacon is more than a project; it's a step towards a future where legal information is transparent and accessible to everyone. We are committed to refining and expanding its capabilities to empower users worldwide. Thank you for your consideration.
