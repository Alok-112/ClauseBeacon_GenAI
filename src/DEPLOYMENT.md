# Deploying Your Application and Running Offline

This guide provides instructions for deploying your Next.js application to Vercel and for setting it up for offline development on your local machine.

---

## 1. Deploying to Vercel

Vercel provides a seamless deployment experience for Next.js applications.

### Prerequisites

- A [Vercel account](https://vercel.com/signup).
- Your project code pushed to a Git repository (e.g., GitHub, GitLab, Bitbucket).
- Your Google AI Gemini API Key.

### Deployment Steps

1.  **Import Project**:
    -   Log in to your Vercel dashboard and click **Add New... > Project**.
    -   Select the Git repository where your project is stored. Vercel will automatically detect that it is a Next.js application.

2.  **Configure Project**:
    -   Vercel will pre-fill the **Build and Output Settings**, which you can leave as default.
    -   Navigate to the **Environment Variables** section. This is a critical step.
    -   You need to add your Google AI API key. Create a new environment variable:
        -   **Name**: `GEMINI_API_KEY`
        -   **Value**: Paste your actual Gemini API key here.

3.  **Deploy**:
    -   Click the **Deploy** button.
    -   Vercel will now build and deploy your application. Once complete, you will be provided with a public URL to access your live site.

---

## 2. Local Offline Setup

To run the application on your local computer for development, follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later recommended) installed on your PC.
- A code editor, such as [Visual Studio Code](https://code.visualstudio.com/).
- Your Google AI Gemini API Key.

### Setup Steps

1.  **Download Project Files**:
    -   Ensure you have all the project files on your local machine.

2.  **Set Up Environment Variables**:
    -   In the root directory of your project, create a new file named `.env.local`.
    -   Open the `.env.local` file and add the following line, replacing `your_api_key_here` with your actual key:
        ```
        GEMINI_API_KEY=your_api_key_here
        ```
    -   This file is kept private and should not be committed to your Git repository.

3.  **Install Dependencies**:
    -   Open a terminal or command prompt in the root folder of your project.
    -   Run the following command to install all the necessary packages:
        ```bash
        npm install
        ```

4.  **Run the Development Servers**:
    -   This application requires two processes to run concurrently: the Next.js frontend and the Genkit AI backend.

    -   **In your first terminal**, run the Genkit server:
        ```bash
        npm run genkit:dev
        ```
        This will start the AI flows and make them available for your app.

    -   **Open a second terminal** and run the Next.js development server:
        ```bash
        npm run dev
        ```

5.  **Access the Application**:
    -   Once both servers are running, you can open your web browser and navigate to [http://localhost:9002](http://localhost:9002) to view and interact with your application locally.