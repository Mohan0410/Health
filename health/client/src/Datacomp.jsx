import React, { useEffect, useState } from 'react';
import './index.css'; // Import the CSS file for styling

const AllDataComponent = () => {
  // Replace YOUR_CHANNEL_ID and YOUR_READ_API_KEY with your ThingSpeak channel ID and read API key
  const channelID = '2413448';
  const apiKey = 'R2GEDN121S9EWYOF';

  const apiUrl = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}`;

  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setAllData(result.feeds);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const formattedDate = dateTime.toLocaleDateString();
    const formattedTime = dateTime.toLocaleTimeString();
    return { formattedDate, formattedTime };
  };

  return (
    <div className='w-[80%] ml-[10%] '>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {allData && (
        <div>
          <h2 className="text-2xl font-bold mb-4">All ThingSpeak Data</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="py-3 px-6 text-left bg-gray-100">Heart Rate</th>
                <th className="py-3 px-6 text-left bg-gray-100">Created At</th>
                <th className="py-3 px-6 text-left bg-gray-100">Time</th>
              </tr>
            </thead>
            <tbody>
              {[...allData].reverse().map((entry) => (
                <tr key={entry.created_at}>
                  <td className="py-2 px-6">{entry.field1}</td>
                  <td className="py-2 px-6">{formatDateTime(entry.created_at).formattedDate}</td>
                  <td className="py-2 px-6">{formatDateTime(entry.created_at).formattedTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllDataComponent;
