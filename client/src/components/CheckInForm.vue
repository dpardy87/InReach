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
import { ref, onMounted } from "vue";
import { fetchGoogleMapsApiKey } from "@/utils/fetchGoogleMapsApiKey";
import axios from "axios";

export default {
  setup() {
    const locationName = ref("");
    const address = ref("");
    const notes = ref("");
    const message = ref("");
    const googleMapsApiKey = ref(null);

    // validate/geocode address
    const validateAddress = async (address) => {
      if (!googleMapsApiKey.value) {
        alert("Google Maps API key is not available.");
        return { valid: false };
      }

      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${googleMapsApiKey.value}`;

      try {
        const response = await axios.get(url);
        if (response.data.status === "OK") {
          const location = response.data.results[0].geometry.location;
          return {
            valid: true,
            latitude: location.lat,
            longitude: location.lng,
          };
        } else {
          console.warn("Invalid address:", response.data.status);
          return { valid: false };
        }
      } catch (error) {
        console.error("Error validating address:", error);
        return { valid: false };
      }
    };

    // form submission
    const submitCheckIn = async () => {
      try {
        // validate address before submitting
        const addressValidation = await validateAddress(address.value);

        if (!addressValidation.valid) {
          alert("Invalid address. Please enter a valid address.");
          return;
        }

        const payload = {
          locationName: locationName.value || null,
          address: address.value || null,
          latitude: addressValidation.latitude,
          longitude: addressValidation.longitude,
          notes: notes.value || null,
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

    onMounted(async () => {
      googleMapsApiKey.value = await fetchGoogleMapsApiKey();
    });

    return {
      locationName,
      address,
      notes,
      message,
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
