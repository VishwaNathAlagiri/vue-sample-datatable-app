<template>
  <v-app>
    <v-overlay 
      :absolute="true" 
      :value="mainOverlay"
    >
      <v-btn 
        @click="generateRandomData" 
        color="success"  
        class="text-none"
      >
        Randomize Data
      </v-btn>
    </v-overlay>
    <v-app-bar 
      v-if="!mainOverlay" 
      app 
      dark
      color="primary" 
    >
      <v-spacer></v-spacer>
      <v-btn 
        @click="generateRandomData" 
        text 
        outlined
      >
        <span class="mr-2 text-none">Randomize Data</span>
      </v-btn>
    </v-app-bar>
    <v-main v-if="!mainOverlay">
      <!--Overlay loader for API calls-->
      <v-overlay 
        v-if="isProgress" 
        :opacity="0.5"
      >
        <v-progress-circular
          :size="70"
          :width="7"
          indeterminate
          class="circular-loader"
        ></v-progress-circular>
      </v-overlay>
      <Home 
        v-if="dataGenerated" 
        :userData="userData" 
      />
    </v-main>
  </v-app>
</template>

<script>
import Home from "./components/Home";
import axios from "axios";

export default {
  name: "App",
  components: {
    Home,
  },
  data: () => ({
    dataGenerated: false,
    userData: [],
    isProgress: false,
    mainOverlay: true,
  }),
  methods: {
    generateRandomData() {
      this.mainOverlay = false;
      this.isProgress = true;
      axios({
        method: "GET",
        url: "http://localhost:8001/generateRandomData",
      })
        .then((res) => {
          this.isProgress = false;
          this.userData = res.data;
          this.dataGenerated = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
