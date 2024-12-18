<template>
  <div class="p-d-flex p-flex-column p-ai-center auth-container">
    <h1 class="welcome-title">Welcome to the Check-In App</h1>
    <Panel class="info-panel">
      <p class="intro-text">
        Thank you for using the Check-In App! This app is designed to help you
        seamlessly manage and track your recovery check-ins. Here's how to get
        started:
      </p>
      <ul class="instructions-list">
        <li v-if="!isAuthenticated">
          <strong>Login:</strong> Click on the
          <span class="highlight">"Login with Google"</span> button below to
          securely log in to your account.
        </li>
        <li v-else>
          <strong>Check-In:</strong> Once logged in, fill out the check-in form
          to update your recovery journey.
        </li>
        <li>
          <strong>Navigation:</strong> Use the app menu to view your previous
          check-ins and track your progress over time.
        </li>
      </ul>
      <p class="support-text">
        Your journey is important, and we are here to support you every step of
        the way!
      </p>
    </Panel>
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
import Panel from "primevue/panel";

export default {
  components: {
    CheckInForm,
    Button,
    Panel,
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

<style scoped>
.auth-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.welcome-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

.info-panel {
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 15px 15px;
}

.intro-text {
  font-size: 1rem;
  margin-bottom: 15px;
  color: #666;
}

.instructions-list {
  list-style: none;
  padding: 0;
  margin: 15px 0;
}

.instructions-list li {
  margin-bottom: 10px;
  font-size: 1rem;
  line-height: 1.5;
  color: #444;
}

.instructions-list li strong {
  font-weight: bold;
  color: #333;
}

.highlight {
  color: #007ad9;
}

.support-text {
  font-size: 0.95rem;
  color: #777;
  margin-top: 20px;
  text-align: center;
}

.auth-button {
  margin-top: 20px;
}
</style>
