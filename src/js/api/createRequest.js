const createRequest = async ({ url, method, data }) => {
    // опции запроса: метод, заголовки и тело (если есть)
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
  
    if (data) options.body = JSON.stringify(data);
  
    const response = await fetch(url, options);
  
    // если ответ не успешен, выводит ошибку
    if (!response.ok) console.error(`HTTP error! status: ${response.status}`);
  
    // если ответом является пустое тело (например, при DELETE), возвращает null
    if (response.status === 204) return null;
  
    return await response.json();
  };
  
  export default createRequest;