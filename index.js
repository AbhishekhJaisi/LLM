require('dotenv').config(); // Load the keys first
const { GoogleGenAI } = require('@google/genai');
const readlineSync = require('readline-sync'); // to read request from terminal

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


const ConversationHistory = [];

async function main() {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: ConversationHistory,
        });

        return response.text;
    }
    catch (err) {
        console.log("Error: " + err.message);
    }
}


async function getWeather(location) {
    const apiKey = process.env.WEATHER_API_KEY;

    const weatherInfo = [];
    for (const { city, date } of location) {
        if (date.toLowerCase() === 'today') {
            const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
            const data = await response.json();
            weatherInfo.push(data);
        }
        else {
            const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&dt=${date}`);
            const data = await response.json();
            weatherInfo.push(data);
        }
    }
    return weatherInfo;                                   // ✅ outside loop, no typo

}

async function chatting() {

    const question = readlineSync.question('How can I help you--> ');

    const prompt = `
You are an AI agent, who will respond to me in JSON format only.
Analyse the user query and try to fetch city and date details from it.
Date format should be in (yyyy-month-date) if user ask for future wether report.
If user ask for today weather, mark date as 'today'
To fetch weather details, I already have soome function which can fetch the weather details for me.

If you need weather information, use the below format "weather_details_needed" to make sure its the first part of LLM.
JSON format should look like below:

{
    "weather_details_needed": true,
    "location": [{"city": "mumbai", "date": "today"}, {"city": "delhi", "date": "2025-03-30"}]
}

Once you have the weather report details, respond me in JSON format only.
{
    "weather_details_needed": false,
    "weather_report": "The temp of Delhi is good, it is 18 degree celcius"
}

User asked this question = ${question}

Strictly follow JSON format, respond only in JSON format
`
    ConversationHistory.push({
        role: "user",
        parts: [{ text: prompt }]
    });

    while (true) {
        let response = await main();

        ConversationHistory.push({ role: 'model', parts: [{ text: response }] });

        let cleanedResponse = response.replace(/^```json/i, '')// Remove starting 
            .replace(/```$/g, '')      // Remove ending marker
            .trim();

        let data;
        try {
            data = JSON.parse(cleanedResponse);
            console.log("Successfully parsed data:", data);
        }
        catch (error) {
            console.error("Failed to parse LLM JSON. Raw output was:", response);
        }

        if (data && data.weather_details_needed === false) {
            console.log(data.weather_report);
            break;
        }

        const weatherInformation = await getWeather(data.location);
        const weatherInfo = JSON.stringify(weatherInformation);

        ConversationHistory.push({ role: 'user', parts: [{ text: weatherInfo }] })
    }
}

chatting();











// When a user asks for the weather in real-time, their request comes to the server as a JS object. But the server doesn't really 'understand' the raw text or the intent. So, the server passes that object to an LLM and tells it: 'Extract the city and date from this and give it back to me as a clean JSON.'

// Once the server gets that JSON, it pulls out the city and date to hit the Weather API. After the API returns the raw weather data, the server sends it back to the LLM again, saying: 'Now, take this data and turn it into a nice, readable report that I can show to the user.'

//user request

// {
//     role: "user",
//     parts: [{text: "Hi Gemini, how are you?"}]
// },
// // Models response
// {
//     role: "model",
//     parts: [{test: "I am doing great, how about you"}]
// }


