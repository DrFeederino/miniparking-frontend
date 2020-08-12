const URL = 'http://localhost:8080/';

const fetchData = async (path, method, body) => {
  const response = await fetch(URL + path, {
    method,
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  });
  console.log('lol did we finish', method, path)
  if (method !== 'DELETE') {
    const data = await response.json();
    return data;
  }

  return null;
};

export default fetchData;
