<template>
  <nav>
    <Menubar :model="menuItems" class="custom-menubar" />
  </nav>
  <router-view />
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Menubar from "primevue/menubar";

export default {
  components: { Menubar },
  setup() {
    const router = useRouter();
    const menuItems = ref([
      {
        label: "Home",
        icon: "pi pi-home",
        command: () => router.push("/"),
      },
      {
        label: "Check-In History",
        icon: "pi pi-calendar",
        command: () => router.push("/checkin/history"),
      },
    ]);

    return { menuItems };
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  display: flex;
  justify-content: center;
  margin: 15px 0;
}

.custom-menubar {
  width: 600px;
  max-width: 100%;
  background-color: #f8f9fa;
  border: none;

  .p-menuitem-link {
    font-weight: bold;
    color: #2c3e50;
    transition: color 0.3s ease;

    &:hover {
      color: #42b983;
    }

    &.router-link-active {
      color: #42b983;
    }
  }
}
</style>
