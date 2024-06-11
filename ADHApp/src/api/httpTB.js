import axios from "axios";
const THINGSBOARD_HOST = 'http://demo.thingsboard.io:80';
const DEVICE_ACCESS_TOKEN = 'tsLa6VxwxospaxNH5rht';

// Function to fetch attributes from ThingsBoard
export const fetchAttributes = async () => {
  try {
    const url = `${THINGSBOARD_HOST}/api/v1/${DEVICE_ACCESS_TOKEN}/attributes`;
    const response = await axios.get(url);

    console.log('Attributes:', response.data.client);
    return response.data.client;
  } catch (error) {
    console.error('Error fetching attributes:', error);
  }
};

export const postClientAttributes = async(payload) => {
     try {
    const url = `${THINGSBOARD_HOST}/api/v1/${DEVICE_ACCESS_TOKEN}/attributes`;
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error posting attribute:', error);
  }
};