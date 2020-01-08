<template>
  <v-app-bar color="grey darken-3" dark fixed app :collapse="collapseToolbar">
    <v-layout v-if="!collapseToolbar">
      <v-toolbar-title class="no-link-style">
        Draw
        <sup>
          <span style="color:yellow">beta</span>
        </sup>
      </v-toolbar-title>
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
