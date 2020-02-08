<template>
  <v-app-bar color="grey darken-3" dark fixed app :collapse="collapseToolbar">
    <v-layout v-if="!collapseToolbar">
      <a href="https://github.com/holwech/draw" target="_blank">
        <v-toolbar-title class="no-link-style">
          View on GitHub
        </v-toolbar-title>
      </a>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <slot></slot>
      </v-toolbar-items>
    </v-layout>
    <v-icon
      v-if="showCollapseButton"
      @click="collapseToolbar = !collapseToolbar"
      >{{
        collapseToolbar ? 'keyboard_arrow_right' : 'keyboard_arrow_left'
      }}</v-icon
    >
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Toolbar extends Vue {
  @Prop({ type: Boolean, default: false })
  private readonly showCollapseButton?: Boolean;

  private collapseToolbar = false;
}
</script>

<style>
.no-link-style {
  color: white;
  text-decoration: none;
}
</style>
