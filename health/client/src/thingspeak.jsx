import React, { useEffect, useState } from 'react';

const ThingSpeakComponent = () => {
  // Replace YOUR_CHANNEL_ID and YOUR_READ_API_KEY with your ThingSpeak channel ID and read API key
  const channelID = '2413448';
  const apiKey = 'R2GEDN121S9EWYOF';

  const apiUrl = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}`;
  const serverEndpoint = 'http://localhost:8080';

  const [latestEntry, setLatestEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertSent, setAlertSent] = useState(false); // Track whether alert has been sent

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const latestEntry = result.feeds[result.feeds.length - 1]; // Access the last entry

        // Check if field1 is less than 70 and alert has not been sent
        if (parseFloat(latestEntry.field1) < 70 && !alertSent) {
          sendAlertToServer(latestEntry.field1);
          setAlertSent(true); // Mark the alert as sent
        } else {
          setAlertSent(false); // Reset alertSent if field1 is not less than 70
        }

        setLatestEntry(latestEntry);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data every 5 seconds (adjust as needed)
    const fetchDataInterval = setInterval(() => {
      fetchData();
    }, 5000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(fetchDataInterval);
  }, [apiUrl, alertSent]);

  const sendAlertToServer = async (field1Value) => {
    try {
      const response = await fetch(`${serverEndpoint}/send-alert?field1Value=${field1Value}`);

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
      console.error('Error sending alert:', error.message);
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
