import React, { useEffect, useState } from 'react';

const ThingSpeakComponent = () => {
  // Replace YOUR_CHANNEL_ID and YOUR_READ_API_KEY with your ThingSpeak channel ID and read API key
  const channelID = '2413448';
  const apiKey = 'R2GEDN121S9EWYOF';

  const apiUrl = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}`;
  const serverEndpoint = 'https://health-server-mohan.onrender.com/';

  const [latestEntry, setLatestEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertSent, setAlertSent] = useState(false); // Track whether alert has been sent
  const currentDate = new Date();
const formattedDate = currentDate.toISOString();

  const [previousTimestamp, setPreviousTimestamp] = useState(formattedDate);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const latestEntry = result.feeds[result.feeds.length - 1];

        // Check if timestamp has changed and alert has not been sent
        console.log(latestEntry.created_at)
        console.log(previousTimestamp)
        if (latestEntry.created_at !== previousTimestamp && parseFloat(latestEntry.field1) < 70 && !alertSent) {
          sendAlertToServer(latestEntry.field1);
          setAlertSent(true);
          setPreviousTimestamp(latestEntry.created_at);
          setLatestEntry(latestEntry);
        } else {
          setAlertSent(false);
        }

        
        
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
      setTimeout(check , 2000);
    };

    // Fetch data every 5 seconds (adjust as needed)
    const fetchDataInterval = setInterval(() => {
      fetchData();
    }, 5000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(fetchDataInterval);
  }, [apiUrl, alertSent, previousTimestamp]);

  const sendAlertToServer = async (field1Value) => {
    try {
      const response = await fetch(`${serverEndpoint}send-alert?field1Value=${field1Value}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response;
      console.log(result); // Log the response from the server

      if (result.success) {
        console.log('Alert sent successfully.');
      } else {
        console.error('Error sending alert:', result.message);
      }
    } catch (error) {
      console.error('Error sending alert:', error.message);
    }
  };
  const check = async (field1Value) => {
    console.log("check")
    try {
      const response = await fetch(`${serverEndpoint}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result); // Log the response from the server

      if (result.success) {
        console.log('Alert sent successfully.');
      } else {
        console.error('Error sending alert:', result.message);
      }
    } catch (error) {
      console.error('PK:', error.message);
    }
  };
  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const formattedDate = dateTime.toLocaleDateString();
    const formattedTime = dateTime.toLocaleTimeString();
    return { formattedDate, formattedTime };
  };

  return (
    <div className='flex justify-center items-center pt-10'>
      <div className='text-lg border p-10'>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {latestEntry && (
          <div>
            <h2>Latest ThingSpeak Entry</h2>
            <p>Heart rate: {latestEntry.field1}</p>
            <p>Created At:</p>
            <p>Date: {formatDateTime(latestEntry.created_at).formattedDate}</p>
            <p>Time: {formatDateTime(latestEntry.created_at).formattedTime}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThingSpeakComponent;
