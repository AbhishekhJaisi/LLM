AI Weather Agent Orchestrator

This project follows an "Agentic Workflow" where the AI acts as an orchestrator:

Natural Language Understanding: The agent takes a user query (e.g., "Delhi ka mausam kaisa hai") and uses Gemini to extract the city and date in a structured JSON format.

Tool Execution: The system detects if weather details are needed. If true, it calls a custom getWeather() function to fetch live data from an external API.

Data Synthesis: The raw weather data is fed back to the LLM to generate a human-friendly, realistic report.

🛠️ Tech Stack
Runtime: Node.js.

AI Model: Google Gemini (via @google/genai).

External API: WeatherAPI.com.

Environment Management: dotenv (to keep API keys secure).

⚙️ Setup Instructions
Clone the repository:

Bash
git clone https://github.com/AbhishekhJaisi/LLM.git
cd LLM
Install dependencies:

Bash
npm install
Configure Environment Variables: Create a .env file in the root directory and add your keys:

Code snippet
GEMINI_API_KEY=your_gemini_key_here
WEATHER_API_KEY=your_weather_api_key_here
(Note: The .env file is ignored by Git to keep your credentials safe)

Run the Agent:

Bash
node index.js
📝 Key Features
Multi-turn Conversation: Maintains ConversationHistory to provide context-aware responses.

JSON-Only Response Logic: Forced JSON formatting for reliable data extraction between the AI and the backend.

Error Handling: Includes robust try-catch blocks for JSON parsing and API fetch requests.
