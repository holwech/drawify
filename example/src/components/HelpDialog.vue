<template>
  <div>
    <v-btn color="white" class="ml-1" tile outlined @click="dialog = true">
      <span color="black"> Help </span>
    </v-btn>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline" primary-title>
          Help
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <slot> </slot>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class HelpDialog extends Vue {
  private dialog = false;
}
</script>
