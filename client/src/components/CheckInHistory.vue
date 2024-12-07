<template>
  <div>
    <h2>Check-In History</h2>
    <DataTable
      :value="checkIns"
      class="p-datatable-gridlines"
      :scrollable="true"
      scrollHeight="400px"
    >
      <Column field="locationName" header="Location Name" />
      <Column field="address" header="Address" />
      <Column field="checkInTime" header="Check-In Time">
        <template #body="{ data }">
          {{ formatDate(data.checkInTime) }}
        </template>
      </Column>
      <Column field="notes" header="Notes" />
      <Column field="distance" header="Distance (miles)" />
      <Column field="userFirstName" header="User">
        <template #body="slotProps">
          {{ slotProps.data.userEmail }}
        </template>
      </Column>
    </DataTable>
    <p v-if="!checkIns.length" class="p-mt-4">No check-ins found.</p>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

export default {
  components: {
    DataTable,
    Column,
  },
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

    const formatDate = (dateString) => {
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          // Fallback for invalid dates
          return "Invalid Date";
        }
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        });
      } catch (error) {
        console.error("Error formatting date:", error);
        // Return the raw value if formatting fails
        return dateString;
      }
    };

    onMounted(fetchCheckIns);

    return {
      checkIns,
      formatDate,
    };
  },
};
</script>
