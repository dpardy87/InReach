<template>
  <div>
    <button @click="checkIn">Check In</button>

    <!-- Feedback for success or error -->
    <p v-if="successMessage">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      successMessage: '',
      errorMessage: '',
    }
  },
  methods: {
    async checkIn() {
      // Check if the browser supports Geolocation
      if (navigator.geolocation) {
        // Request the user's current position
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            const token = localStorage.getItem('jwtToken')

            try {
              const response = await axios.post(
                '/checkin', // API endpoint
                { latitude, longitude }, // Send latitude and longitude as request body
                {
                  headers: {
                    Authorization: `Bearer ${token}`, // Pass JWT for authorization
                    'Content-Type': 'application/json',
                  },
                }
              )

              // Set success message
              this.successMessage = 'Check-in successful!'
              this.errorMessage = '' // Clear any error messages
            } catch (error) {
              // Handle errors (e.g., network error, 401 Unauthorized, etc.)
              this.successMessage = ''
              if (error.response && error.response.status === 401) {
                this.errorMessage = 'Unauthorized. Please log in.'
              } else {
                this.errorMessage = 'Check-in failed. Please try again.'
              }
            }
          },
          (error) => {
            // Handle error with geolocation
            this.errorMessage =
              'Unable to retrieve your location. Please enable location services.'
          }
        )
      } else {
        this.errorMessage = 'Geolocation is not supported by this browser.'
      }
    },
  },
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
