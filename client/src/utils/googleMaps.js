import axios from "axios";

/**
 * Fetch the distance between two locations via the backend proxy.
 * @param {string} origin - Origin location in "lat,lng" format.
 * @param {string} destination - Destination location in "lat,lng" format.
 * @returns {Promise<number>} - Distance in kilometers.
 */
export const getDistanceFromGoogle = async (origin, destination) => {
  try {
    const response = await axios.get("http://localhost:3000/maps/distance", {
      params: { origins: origin, destinations: destination },
      withCredentials: true, // Ensure cookies are sent for authentication
    });

    const distanceData = response.data.rows[0].elements[0];
    if (distanceData.status === "OK") {
      const distanceInMeters = distanceData.distance.value;
      const distanceInMiles = distanceInMeters * 0.000621371; // Convert meters to miles
      return distanceInMiles;
    } else {
      console.error("Error in distance calculation:", distanceData.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching distance:", error);
    return null;
  }
};

export const getAutocompleteSuggestions = async (input) => {
  try {
    const response = await axios.get(
      "http://localhost:3000/maps/autocomplete",
      {
        params: { input },
        withCredentials: true, // Ensure cookies are sent for authentication
      }
    );

    const predictions = response.data.predictions;
    return predictions || [];
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error);
    return [];
  }
};
