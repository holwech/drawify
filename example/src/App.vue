<template>
  <v-app>
    <v-main>
      <Editor />
    </v-main>
  </v-app>
</template>

<script>
import Editor from './layouts/Editor.vue';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  components: {
    Editor,
  },
})
export default class App extends Vue {}
</script>
