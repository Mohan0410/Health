const express = require("express");
const app = express();
const accountSid = 'AC1372059dc2650a16018d587709cbefcd';
const authToken = '033a2cfb1ede5153d2d92ee3624c92ea';
const client = require('twilio')(accountSid, authToken);

// Use isomorphic-fetch instead of node-fetch
const fetch = require('isomorphic-fetch');

const serverEndpoint = 'https://health-server-mohan.onrender.com/';

// Track the previous number of entries
let previousEntryCount = 0;

// Flag to indicate if the processing is in progress
let isProcessing = false;

app.get("/", async (req, res) => {
  try {
    // Fetch data from ThingSpeak
    await fetchDataAndSendAlert();
  } catch (error) {
    console.error('Error sending alert:', error.message);
  }

  res.status(200).json({ success: true, message: "Server is running" });
});

app.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});

// Use setInterval for repeating the process every second
setInterval(() => {
  // Check if processing is already in progress
  if (!isProcessing) {
    fetchDataAndSendAlert();
  }
}, 1000); // 1 second in milliseconds

async function fetchDataAndSendAlert() {
  try {
    // Set the processing flag to true to prevent concurrent processing
    isProcessing = true;

    // Fetch data from ThingSpeak
    const thingSpeakData = await fetchDataFromThingSpeak();

    if (thingSpeakData && thingSpeakData.field1 && thingSpeakData.created_at) {
      const field1Value = parseFloat(thingSpeakData.field1);

      // Check if the number of entries has increased (indicating a new entry)
      if (thingSpeakData.entry_id > previousEntryCount) {
        // if (field1Value < 90 || field1Value > 100) {
          const message = await client.messages.create({
            body : `BPM value is ${
              field1Value < 60 ? 'low' : field1Value > 100 ? 'high' : 'normal'
            }: ${field1Value}`,
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+919059703577'
          });

          console.log(`Message sent successfully. SID: ${message.sid}`);
        // } else {
        //   console.log('Field1 value is normal.');
        // }

        // Update the previous entry count
        previousEntryCount = thingSpeakData.entry_id;
      } else {
        console.log('No new entry detected.');
      }
    } else {
      console.error('Error: Unable to fetch data from ThingSpeak');
    }
  } catch (error) {
    console.error('Error sending alert:', error.message);
  } finally {
    // Set the processing flag back to false
    isProcessing = false;
  }
}

async function fetchDataFromThingSpeak() {
  try {
    const channelID = '2413448';
    const apiKey = 'R2GEDN121S9EWYOF';
    const apiUrl = `https://api.thingspeak.com/channels/${channelID}/feeds/last.json?api_key=${apiKey}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('Error fetching data from ThingSpeak:', error.message);
    return null;
  }
}
