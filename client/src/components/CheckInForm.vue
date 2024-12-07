<template>
  <div class="p-fluid p-grid form-container">
    <h2 class="p-col-12">Check In</h2>
    <!-- Location Name Input -->
    <div class="p-field p-col-12 p-md-6">
      <label for="locationName" class="form-label">Location Name</label>
      <InputText
        id="locationName"
        v-model="locationName"
        class="form-input"
        placeholder="Enter location name"
      />
    </div>
    <!-- Address Input -->
    <div class="p-field p-col-12 p-md-6">
      <label for="address" class="form-label">Address</label>
      <InputText
        id="address"
        v-model="address"
        class="form-input"
        placeholder="Enter address"
      />
    </div>
    <!-- Notes Input -->
    <div class="p-field p-col-12">
      <label for="notes" class="form-label">Notes</label>
      <Textarea
        id="notes"
        v-model="notes"
        class="form-input"
        rows="4"
        placeholder="Add notes (optional)"
      />
    </div>
    <!-- Submit Button -->
    <div class="p-col-12 button-container">
      <Button
        label="Submit Check-In"
        icon="pi pi-check"
        class="p-button-rounded p-button-success"
        @click="submitCheckIn"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getDistanceFromGoogle } from "@/utils/googleMaps";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import axios from "axios";

export default {
  components: {
    InputText,
    Textarea,
    Button,
  },
  setup() {
    const router = useRouter();
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
        router.push("/checkin/history");
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
.form-container {
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.p-field {
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

.form-input {
  width: 100%;
}

.button-container {
  text-align: center;
}
</style>
