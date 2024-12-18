<template>
  <div>
    <div class="datatable-header">
      <Button
        icon="pi pi-external-link"
        label="Export"
        class="p-button-sm p-button-outlined"
        @click="exportCSV"
      />
    </div>
    <DataTable
      :value="checkIns"
      class=""
      :scrollable="true"
      size="small"
      scrollHeight="400px"
    >
      <Column
        field="locationName"
        exportHeader="Location"
        header="Location Name"
      />
      <Column field="address" header="Address" />
      <Column field="checkInTime" header="Check-In Time">
        <template #body="{ data }">
          {{ formatDate(data.checkInTime) }}
        </template>
      </Column>
      <Column field="notes" header="Notes" />
      <Column field="distance" header="Distance (Miles)" />
    </DataTable>
    <p v-if="!checkIns.length" class="p-mt-4">No check-ins found.</p>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";

export default {
  components: {
    DataTable,
    Column,
    Button,
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

    const exportCSV = () => {
      const csvHeader =
        "Location,Check-in Time,Distance from Location (Miles),Notes\n";
      const csvRows = checkIns.value.map((record) =>
        formatCSVRecord(record, formatDate)
      );
      const csvContent = csvHeader + csvRows.join("\n");

      // create Blob with CSV content
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // create hidden download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "checkin_history.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const formatCSVRecord = (record, formatDate) => {
      // needed since formatDate splits using commas
      return [
        `"${record.locationName}"`,
        `"${formatDate(record.checkInTime)}"`,
        `"${record.distance}"`,
        `"${record.notes}"`,
      ].join(",");
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
      exportCSV,
      checkIns,
      formatDate,
    };
  },
};
</script>

<style scoped>
.datatable-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.p-button-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}
</style>
