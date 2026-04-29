# Persona-Based AI Chatbot - Scaler Academy

This is a persona-based AI chatbot built as part of the Prompt Engineering assignment for Scaler Academy. It features three distinct personas: Anshuman Singh, Abhimanyu Saxena, and Kshitij Mishra. The app allows users to interact with each persona, with the system prompt changing dynamically based on the active persona.

## Features
- **Three distinct personas** with carefully crafted system prompts (including Few-shot, CoT, Output instructions, and constraints).
- **Persona switcher** that resets the conversation when changing personas.
- **Suggestion chips** tailored to each persona to get the conversation started.
- **Typing indicator** for API calls.
- **Responsive design** for mobile and desktop.
- Built using React, Vite, and the Gemini API.

## Setup Instructions

1. Clone the repository.
2. Navigate to the project directory:
   ```bash
   cd persona-chatbot
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory by copying the `.env.example` file:
   ```bash
   cp .env.example .env
   ```
5. Add your Gemini API key to the `.env` file:
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## Prompts & Reflection
- All system prompts used for the personas, along with detailed explanations of their structure, can be found in `prompts.md`.
- A reflection on the process, including thoughts on the GIGO principle, can be found in `reflection.md`.

## Deployed Application
Live URL: *(Vercel/Netlify URL will go here)*
