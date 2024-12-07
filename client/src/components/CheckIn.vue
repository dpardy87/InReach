<template>
  <div class="p-d-flex p-flex-column p-ai-center auth-container">
    <h1>Welcome to the Check-In App</h1>
    <!-- Login Button -->
    <Button
      v-if="!isAuthenticated"
      label="Login with Google"
      icon="pi pi-google"
      class="p-button-rounded p-button-primary auth-button"
      @click="redirectToGoogle"
    />
    <!-- Check-In Form -->
    <CheckInForm v-else />
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import CheckInForm from "@/components/CheckInForm.vue";
import Button from "primevue/button";

export default {
  components: {
    CheckInForm,
    Button,
  },
  setup() {
    const isAuthenticated = ref(false);

    const redirectToGoogle = () => {
      // redirect to Google OAuth
      window.location.href = "http://localhost:3000/auth/google";
    };

    const fetchAccessToken = async () => {
      try {
        // check if user is authenticated via validate endpoint
        const response = await axios.get(
          "http://localhost:3000/auth/validate",
          {
            withCredentials: true, // send cookies with the request
          }
        );

        if (response.data?.authenticated) {
          console.log("User is authenticated.");
          isAuthenticated.value = true;
        } else {
          console.warn("User is not authenticated.");
        }
      } catch (error) {
        console.error("Error validating access token:", error);
      }
    };

    onMounted(fetchAccessToken);

    return {
      isAuthenticated,
      redirectToGoogle,
    };
  },
};
</script>

<style></style>
