async function createRequest() {
  const apiUrl = 'http://localhost:3000/news';

  try {
    console.log('Sending request to:', apiUrl); // Логирование URL

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('Received response, status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorData}`);
    }

    const data = await response.json();
    console.log('Parsed data:', data); // Логирование данных
    return data;
  } catch (error) {
    console.error('Full fetch error:', {
      message: error.message,
      stack: error.stack,
      type: error.name,
    });
    throw new Error(`Network request failed: ${error.message}`);
  }
}

export default createRequest;
