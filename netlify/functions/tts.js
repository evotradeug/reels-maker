// netlify/functions/tts.js
const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  try {
    // Get the text parameter from the query string.
    const { text } = event.queryStringParameters;
    if (!text) {
      return { statusCode: 400, body: "Missing text parameter" };
    }

    // Build the VoiceRSS URL using your API key.
    const apiKey = "152c1c5a966d43e597738a44b7d55988";
    const voiceRssUrl = `https://api.voicerss.org/?key=${apiKey}&hl=en-us&src=${encodeURIComponent(
      text
    )}&r=0&c=MP3&f=44khz_16bit_stereo`;

    // Fetch the audio from VoiceRSS.
    const response = await fetch(voiceRssUrl);
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `Error fetching TTS: ${response.statusText}`,
      };
    }

    // Get the audio as a buffer.
    const buffer = await response.arrayBuffer();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Access-Control-Allow-Origin": "*", // Allow CORS for your site.
      },
      // Convert buffer to Base64 string.
      body: Buffer.from(buffer).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
