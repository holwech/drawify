<template>
  <v-app>
    <v-content>
      <Main/>
    </v-content>
  </v-app>
</template>

<script>
import Main from './components/Main';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  components: {
    Main,
  },
})
export default class App extends Vue {
}
</script>
