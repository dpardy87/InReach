<template>
  <div class="auth-container">
    <h1>Welcome to the Check-In App</h1>
    <button
      v-if="!isAuthenticated"
      @click="redirectToGoogle"
      class="auth-button"
    >
      Login with Google
    </button>
    <CheckInForm v-else />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import CheckInForm from "@/components/CheckInForm.vue";

export default {
  components: {
    CheckInForm,
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

<style>
.auth-container {
  text-align: center;
  margin-top: 50px;
}

.auth-button {
  background-color: #4285f4;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.auth-button:hover {
  background-color: #357ae8;
}
</style>
