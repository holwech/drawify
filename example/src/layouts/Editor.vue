<template>
  <div>
    <v-app id="inspire">
      <Toolbar :show-collapse-button="true">
        <v-btn text>
          {{
          timer.timeMonitor.minutes +
          ':' +
          timer.timeMonitor.seconds +
          ' / ' +
          timer.timeMonitor.lengthMinutes +
          ':' +
          timer.timeMonitor.lengthSeconds
          }}
        </v-btn>
        <v-btn depressed tile text @click="console.log(controller.export())">Export</v-btn>
        <v-btn depressed tile text @click="controller.restart()">
          <v-icon>replay</v-icon>
        </v-btn>
        <!-- <v-btn color="white" @click="controller.reverse()"><v-icon color="black">fast_rewind</v-icon></v-btn> -->
        <v-btn v-if="isPlaying" tile depressed text @click="controller.pause()">
          <v-icon color="red">fiber_manual_record</v-icon>
        </v-btn>
        <v-btn v-else color="white" tile depressed @click="controller.start()">
          <v-icon color="black">play_arrow</v-icon>
        </v-btn>
        <!-- <v-toolbar-items class="hidden-sm-and-down">
          <v-select
            item-text="text"
            item-value="value"
            :items="selectSmoothnessItems"
            @input="setStrokeProperties"
            v-model="smoothness"
            label="Smoothness"
            return-object
            color='black'
          ></v-select>
        </v-toolbar-items>-->
        <SettingsDialog>
          <v-select
            v-model="color"
            item-text="text"
            item-value="value"
            :items="selectColorItems"
            label="Color"
            return-object
            color="black"
            @input="setStrokeProperties('stroke')"
          ></v-select>
          <v-select
            v-model="width"
            item-text="text"
            item-value="value"
            :items="selectWidthItems"
            label="Width"
            return-object
            color="black"
            @input="setStrokeProperties('stroke-width')"
          ></v-select>
          <v-select
            v-model="fillColor"
            item-text="text"
            item-value="value"
            :items="selectColorItems"
            label="Fill color"
            return-object
            color="black"
            @input="setStrokeProperties('fill')"
          ></v-select>
          <v-checkbox v-model="fill" label="Fill" @change="setStrokeProperties('fill')"></v-checkbox>
        </SettingsDialog>
        <HelpDialog>
          <v-flex>
            <v-list>
              <v-list-tile v-for="text in helpText" :key="text">
                <v-list-tile-action>
                  <v-icon>star</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title v-text="text"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>
        </HelpDialog>
      </Toolbar>
      <v-main ma-0 pa-0 style="padding: 0px">
        <v-container fluid fill-height ma-0 pa-0>
          <v-layout justify-center align-center row wrap>
            <v-flex text-xs-center>
              <svg
                id="svg"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                version="1.1"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import HelpDialog from '../components/HelpDialog.vue';
import SettingsDialog from '../components/SettingsDialog.vue';
import ServiceBuilder from 'drawify/lib/ServiceBuilder';
import { StrokeAttributes, IStrokeProps } from 'drawify/lib/Interfaces/ActionInterfaces';
import { AppStates } from 'drawify/lib/Interfaces/AppInterfaces';
import Toolbar from './Toolbar.vue';
import Service from 'drawify/lib/Controllers/Service';
import AppState from 'drawify/lib/State/AppState';
import Timer from 'drawify/lib/Timer/Timer';

@Component({
  components: {
    SettingsDialog,
    HelpDialog,
    Toolbar,
  },
})
export default class Editor extends Vue {
  @Prop(String) readonly id?: string;

  private drawer = false;
  private controller?: Service = undefined;
  private state = new AppState();
  private timer = new Timer();
  private dialog = false;
  private recordColor = 'grey';
  private recording = false;
  private playing = false;
  private msg: string = 'Drawing board';
  private smoothness = { text: '4 - Sharp curves', value: 4 };
  private slider = 0;
  private color = { text: 'Black', value: 'black' };
  private width = { text: '1px', value: 1 };
  private fillColor = { text: 'Black', value: 'black' };
  private panMode: string = 'off';
  private selectSmoothnessItems = [
    { text: '1 - No smoothing', value: 1 },
    { text: '4 - Sharp curves', value: 4 },
    { text: '20 - Hyper smooth curves', value: 20 },
  ];
  private selectColorItems = [
    { text: 'Black', value: 'black' },
    { text: 'Blue', value: 'blue' },
    { text: 'Red', value: 'red' },
    { text: 'Green', value: 'green' },
  ];
  private selectWidthItems = [
    { text: '1px', value: 1 },
    { text: '2px', value: 2 },
    { text: '4px', value: 4 },
    { text: '8px', value: 8 },
  ];
  private fill = false;
  private helpText = [
    'Click play/space to start recording',
    'Click reverse and then play to view recording',
    'Hold CTRL and click left mouse button to pan',
    'Scroll to zoom',
    'Click on drawing to remove it',
  ];
  private strokeProps: IStrokeProps = {
    stroke: this.color.value,
    'stroke-width': this.width.value,
    'buffer-size': this.smoothness.value,
    fill: undefined,
  };

  private playToggle(e: KeyboardEvent): void {
    if (e.keyCode === 32 || e.key === ' ') {
      if (this.isPlaying) {
        this.controller!.pause();
      } else {
        this.controller!.start();
      }
    }
  }

  private panOn(e: KeyboardEvent): void {
    if (e.keyCode === 17) {
      this.panMode = 'on';
      this.controller!.stateToggle(true);
    }
  }

  private panOff(e: KeyboardEvent): void {
    if (e.keyCode === 17) {
      this.panMode = 'off';
      this.controller!.stateToggle(false);
    }
  }

  private mounted(): void {
    this.controller = new ServiceBuilder().build(document.getElementById('svg')!, this.state, this.timer);
    this.controller!.setStrokeProperties(this.strokeProps);
    window.addEventListener('keydown', this.panOn);
    window.addEventListener('keyup', this.panOff);
    window.addEventListener('keydown', this.playToggle);
  }

  private clear(): void {
    this.controller!.clear();
  }

  private setStrokeProperties(attr: StrokeAttributes): void {
    let value;

    let currentStrokeProps = this.strokeProps;
    switch (attr) {
      case StrokeAttributes.COLOR:
        value = this.color.value;
        currentStrokeProps[attr] = value;
        break;
      case StrokeAttributes.WIDTH:
        value = this.width.value;
        currentStrokeProps[attr] = value;
        break;
      case StrokeAttributes.BUFFER_SIZE:
        value = this.smoothness.value;
        currentStrokeProps[attr] = value;
        break;
      case StrokeAttributes.FILL:
        value = this.fill ? this.fillColor.value : undefined;
        currentStrokeProps[attr] = value;
        break;
      default:
        break;
    }
    this.controller!.setStrokeProperties(this.strokeProps);
  }

  get isPlaying(): boolean {
    return this.state.state === AppStates.START;
    // if (this.state.state === AppStates.PLAYING) {
    //   this.playing = false;
    //   this.controller.pause();
    // } else {
    //   this.playing = true;
    //   this.controller.start();
    // }
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

#svg {
  border: 0px solid black;
}
</style>
