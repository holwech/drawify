<template>
  <div>
    <v-app id="inspire">
      <v-navigation-drawer
        fixed
        v-model="drawer"
        app
        >
        <v-list dense>
          <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>contact_mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Contact</v-list-tile-title>
          </v-list-tile-content>
          </v-list-tile>
        </v-list>
        </v-navigation-drawer>
        <v-toolbar color="indigo" dark fixed app>
          <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
          <v-toolbar-title>Application</v-toolbar-title>
            {{ timeObj.minutes + ":" + timeObj.seconds }}
            <v-spacer></v-spacer>
            <v-btn flat small>Pan {{ this.panMode }} (Hold CTRL)</v-btn>
            <v-btn small @click="clear">Clear</v-btn>
            <v-btn color="success" @click="controller.startRecording()">Start recording</v-btn>
            <v-btn @click="controller.stopRecording()">Stop recording</v-btn>
            <!-- <v-btn @click="controller.printLog()"> Print log </v-btn> -->
            <v-btn color="success" @click="controller.startPlayer()"> Play </v-btn>
            <v-btn color="success" @click="controller.reversePlayer()"> Reverse </v-btn>
            <v-btn @click="controller.pausePlayer()"> Pause </v-btn>
            <v-toolbar-items class="hidden-sm-and-down">
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
            </v-toolbar-items>
            <v-toolbar-items class="hidden-sm-and-down">
              <v-select
                item-text="text"
                item-value="value"
                :items="selectColorItems"
                @input="setStrokeProperties"
                v-model="color"
                label="Color"
                return-object
                color='black'
              ></v-select>
            </v-toolbar-items>
            <v-toolbar-items class="hidden-sm-and-down">
              <v-select
                item-text="text"
                item-value="value"
                :items="selectWidthItems"
                @input="setStrokeProperties"
                v-model="width"
                label="Color"
                return-object
                color='black'
              ></v-select>
            </v-toolbar-items>
          </v-toolbar>
        <v-content ma-0 pa-0 style="padding: 0px">
            <v-container
              fluid
              grid-list-lg
            >
              <v-layout
                row
                wrap
              >
                <v-flex xs12>
                  <v-slider
                    v-model="slider"
                  ></v-slider>
                </v-flex>
              </v-layout>
            </v-container>
          <v-container fluid fill-height ma-0 pa-0>
            <v-layout
            justify-center
            align-center
            row wrap
            >
            <v-flex text-xs-center>
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="svgElement"
                  viewBox="0 0 1200 800"
                  enable-background="new 0 0 1200 800"
                  xml:space="preserve"
              >
              </svg>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
      <v-footer color="indigo" app inset>
        <span class="white--text">&copy; 2017</span>
      </v-footer>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { BoardState, IStrokeProps } from '../draw/utils/boardInterfaces';
import { Controller } from '../draw/InterfaceController';

@Component
export default class Main extends Vue {
  private drawer = false;
  private controller!: Controller;
  private dialog = false;
  private msg: string = 'Drawing board';
  private smoothness = { text: '4 - Sharp curves', value: 4};
  private slider = 0;
  private color = { text: 'Black', value: 'black'};
  private width = { text: '1px', value: 1};
  private panMode: string = 'off';
  private timeObj = { minutes: 0, seconds: 0};
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

  private panOn(e: KeyboardEvent): void {
    if (e.keyCode === 17) {
      this.panMode = 'on';
      this.controller.setState(BoardState.PAN);
    }
  }

  private panOff(e: KeyboardEvent): void {
    if (e.keyCode === 17) {
      this.panMode = 'off';
      this.controller.setState(BoardState.DRAW);
    }
  }

  private mounted(): void {
    this.controller = new Controller('svgElement', {
      color: this.color.value,
      width: this.width.value,
      bufferSize: this.smoothness.value,
    });
    this.controller.app.state.timer.bindTimeMonitor(this.timeObj);
    window.addEventListener('keydown', this.panOn);
    window.addEventListener('keyup', this.panOff);
  }

  private clear(): void {
    this.controller.clear();
  }

  private setStrokeProperties(): void {
    console.log(this.smoothness.value, this.color.value, this.width.value);
    this.controller.setStrokeProperties({
      color: this.color.value,
      width: this.width.value,
      bufferSize: this.smoothness.value,
    });
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

#svgElement {
  border: 1px solid black;
}

</style>