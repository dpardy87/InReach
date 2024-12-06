<template>
  <div>
    <h2>Check-In History</h2>
    <ul v-if="checkIns.length">
      <li v-for="checkIn in checkIns" :key="checkIn.checkInId">
        <h3>{{ checkIn.locationName }}</h3>
        <p><strong>Address:</strong> {{ checkIn.address }}</p>
        <p>
          <strong>Check-In Time:</strong>
          {{ new Date(checkIn.checkInTime).toLocaleString() }}
        </p>
        <p><strong>Notes:</strong> {{ checkIn.notes }}</p>
        <p><strong>Distance:</strong> {{ checkIn.distance }} miles</p>
        <p>
          <strong>User:</strong> {{ checkIn.userFirstName }} ({{
            checkIn.userEmail
          }})
        </p>
        <p>
          <strong>Location Created At:</strong>
          {{ new Date(checkIn.locationCreatedAt).toLocaleString() }}
        </p>
      </li>
    </ul>
    <p v-else>No check-ins found.</p>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";

export default {
  setup() {
    const checkIns = ref([]);

    const fetchCheckIns = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/checkin/history",
          {
            withCredentials: true,
          }
        );
        checkIns.value = response.data;
      } catch (error) {
        console.error("Error fetching check-ins:", error);
      }
    };

    onMounted(fetchCheckIns);

    return {
      checkIns,
    };
  },
};
</script>
