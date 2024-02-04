// server/server.js
const express = require("express");
const app = express();
const accountSid = 'AC1372059dc2650a16018d587709cbefcd';
const authToken = '033a2cfb1ede5153d2d92ee3624c92ea';
const client = require('twilio')(accountSid, authToken);

let lastSentValue = null;

app.get("/send-alert", async (req, res) => {
  const { field1Value } = req.query; // Extract field1Value parameter from query

  try {
    const isLowField1Value = parseFloat(field1Value) < 70; // Replace with your actual logic

    // Check if the value has changed since the last alert
    if (isLowField1Value && field1Value !== lastSentValue) {
      const message = await client.messages.create({
        body: `Field1 value is low: ${field1Value}`,
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+919059703577'
      });

      console.log(`Message sent successfully. SID: ${message.sid}`);
      lastSentValue = field1Value; // Update the last sent value
      res.status(200).json({ success: true, message: "Alert sent successfully" });
    } else if (!isLowField1Value) {
      console.log('Field1 value is normal.');
      lastSentValue = null; // Reset the last sent value when the value is normal
      res.status(200).json({ success: true, message: "Field1 value is normal" });
    } else {
      console.log('Alert not sent. Field1 value has not changed.');
      res.status(200).json({ success: true, message: "Alert not sent. Field1 value has not changed" });
    }
  } catch (error) {
    console.error('Error sending alert:', error.message);
    res.status(500).json({ success: false, message: "Error sending alert" });
  }
});

app.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});
