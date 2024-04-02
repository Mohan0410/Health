import React, { useEffect, useState } from 'react';
import download from "./assests/download.jpeg"
const ThingSpeakComponent = () => {
  const channelID = '2413448';
  const apiKey = 'R2GEDN121S9EWYOF';

  const apiUrl = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}`;

  const [latestEntry, setLatestEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setName(result.channel.name)
        const latestEntry = result.feeds[result.feeds.length - 1];
        

        setLatestEntry(latestEntry);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
//hello
    // Fetch data every 5 seconds (adjust as needed)
    const fetchDataInterval = setInterval(() => {
      fetchData();
    }, 5000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(fetchDataInterval);
  }, [apiUrl]);

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const formattedDate = dateTime.toLocaleDateString();
    const formattedTime = dateTime.toLocaleTimeString();
    return { formattedDate, formattedTime };
  };

  return (
    <div className='flex justify-center items-center pt-10'>
      <div className='text-lg border p-10 border-slate-600'>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {latestEntry && (
          <div>
            <h2 className='font-bold l'>Latest ThingSpeak Entry</h2>
            <img className='' src={download}></img>
            <p className='flex justify-between'><span className='font-semibold'>Name :</span> {name}</p>
            <p className='flex justify-between'><span className='font-semibold'>Blood Pressure :</span> {latestEntry.field1}/{latestEntry.field2}</p>
            <p className='flex justify-between'><span className='font-semibold'>HeartRate :</span> {latestEntry.field3}</p>
            <p className='flex justify-between'><span className='font-semibold'>SPO2 :</span> {latestEntry.field5}</p>
            <p className='flex justify-between'><span className='font-semibold'>Temperature :</span> {latestEntry.field4}</p>


            <p className='flex justify-between'><span className='font-semibold'>Created At :</span></p>
            <p className='flex justify-between'><span className='font-semibold'>Date :</span> {formatDateTime(latestEntry.created_at).formattedDate}</p>
            <p className='flex justify-between'><span className='font-semibold'>Time :</span> {formatDateTime(latestEntry.created_at).formattedTime}</p>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default ThingSpeakComponent;
