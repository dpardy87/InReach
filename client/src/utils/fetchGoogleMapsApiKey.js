import axios from "axios";

export const fetchGoogleMapsApiKey = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/google-maps-api-key"
    );
    return response.data.apiKey;
  } catch (error) {
    console.error("Error fetching Google Maps API key:", error);
    return null;
  }
};
