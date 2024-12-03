<template>
  <div class="auth-container">
    <button @click="redirectToGoogle" class="auth-button">
      Login with Google
    </button>
    <div v-if="accessToken" class="token-display">
      <p><strong>Access Token:</strong></p>
      <textarea readonly v-model="accessToken"></textarea>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      accessToken: null,
    };
  },
  methods: {
    redirectToGoogle() {
      // redirect to google login
      window.location.href = "http://localhost:3000/auth/google";
    },
    async fetchAccessToken() {
      try {
        // get user info after redirect
        const response = await axios.get(
          "http://localhost:3000/auth/google/callback",
          {
            // options
          }
        );

        if (
          response.data &&
          response.data.user &&
          response.data.user.accessToken
        ) {
          this.accessToken = response.data.user.accessToken;
          console.log("Access token fetched successfully:", this.accessToken);
        } else {
          console.warn("Access token not found in the response.");
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    },
  },
  mounted() {
    this.fetchAccessToken();
  },
};
</script>

<style>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

.auth-button {
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
}

.auth-button:hover {
  background-color: #357ae8;
}

.token-display {
  margin-top: 20px;
  text-align: center;
}

textarea {
  width: 300px;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  font-family: inherit;
  font-size: 14px;
}
</style>
