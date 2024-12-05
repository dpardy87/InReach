<template>
  <div class="checkin-form">
    <h1>Check In</h1>
    <form @submit.prevent="submitCheckIn">
      <div>
        <label for="locationName">Location Name:</label>
        <input type="text" id="locationName" v-model="locationName" required />
      </div>
      <div>
        <label for="address">Address:</label>
        <input type="text" id="address" v-model="address" required />
      </div>
      <div>
        <label for="notes">Notes:</label>
        <textarea id="notes" v-model="notes"></textarea>
      </div>
      <button type="submit" class="checkin-button">Check In</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import { ref } from "vue";
import { getDistanceFromGoogle } from "@/utils/googleMaps";
import axios from "axios";

export default {
  setup() {
    const locationName = ref("");
    const address = ref("");
    const distance = ref(null);
    const notes = ref("");
    const message = ref("");

    // validate/geocode address
    const validateAddress = async (address) => {
      try {
        const response = await axios.get("http://localhost:3000/maps/geocode", {
          params: { address },
        });

        if (response.data.status === "OK" && response.data.results.length > 0) {
          const location = response.data.results[0].geometry.location;
          return {
            valid: true,
            latitude: location.lat,
            longitude: location.lng,
          };
        } else {
          console.warn(
            "Invalid address or no valid results found:",
            response.data
          );
          return { valid: false };
        }
      } catch (error) {
        console.error("Error validating address:", error);
        return { valid: false };
      }
    };

    // pass in addressValidation arg to avoid calling validateAddress() twice
    const calculateDistance = async (addressValidation) => {
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.");
        return null;
      }

      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const userLocation = `${position.coords.latitude},${position.coords.longitude}`;

            // Use the already validated address
            if (!addressValidation.valid) {
              console.warn("Invalid address for distance calculation.");
              return resolve(null);
            }

            const destination = `${addressValidation.latitude},${addressValidation.longitude}`;
            try {
              const distance = await getDistanceFromGoogle(
                userLocation,
                destination
              );
              // return the calculated distance
              resolve(distance);
            } catch (error) {
              console.error("Error calculating distance:", error);
              reject(error);
            }
          },
          (error) => {
            console.error("Error getting user location:", error);
            reject(error);
          }
        );
      });
    };

    const submitCheckIn = async () => {
      try {
        // Validate address first and store the result
        const addressValidation = await validateAddress(address.value);

        if (!addressValidation.valid) {
          alert("Invalid address. Please enter a valid address.");
          return;
        }

        // Pass the validated address to calculateDistance
        const calculatedDistance = await calculateDistance(addressValidation);

        const payload = {
          locationName: locationName.value || null,
          address: address.value || null,
          latitude: addressValidation.latitude,
          longitude: addressValidation.longitude,
          notes: notes.value || null,
          distance: calculatedDistance,
        };

        const response = await axios.post(
          "http://localhost:3000/checkin",
          payload,
          {
            withCredentials: true,
          }
        );

        console.log("Check-in successful:", response.data);
        message.value = "Check-in successful!";
      } catch (error) {
        console.error("Error during check-in:", error);
        message.value = "Check-in failed. Please try again.";
      }
    };

    return {
      locationName,
      address,
      notes,
      message,
      distance,
      calculateDistance,
      submitCheckIn,
    };
  },
};
</script>

<style scoped>
.checkin-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.checkin-form h1 {
  text-align: center;
  margin-bottom: 20px;
}

.checkin-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.checkin-form input,
.checkin-form textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.checkin-form button {
  display: block;
  width: 100%;
  background-color: #4285f4;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.checkin-form button:hover {
  background-color: #357ae8;
}

.checkin-form p {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: green;
}
</style>
