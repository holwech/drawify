<template>
  <div>
    <h1>{{ msg }}</h1>
    <div id="divSmoothingFactor">
        <label for="cmbBufferSize">Buffer size:</label>
        <select v-model="smoothness" @change="setStrokeProperties" id="cmbBufferSize">
            <option value="1">1 - No smoothing</option>
            <option value="4">4 - Sharp curves</option>
            <option value="8" selected="selected">8 - Smooth curves</option>
            <option value="12">12 - Very smooth curves</option>
            <option value="16">16 - Super smooth curves</option>
            <option value="20">20 - Hyper smooth curves</option>
        </select>
    </div>
    <div id="divStrokeWidth">
        <label for="strokeWidth">Stroke width:</label>
        <select v-model="width" @change="setStrokeProperties" id="strokeWidth">
            <option value="1">1</option>
            <option value="2" selected="selected">2</option>
            <option value="4">4</option>
            <option value="6">6</option>
            <option value="8">8</option>
        </select>
    </div>
    <div id="divColorSelect">
        <label for="strokeColor">Stroke color:</label>
        <select v-model="color" @change="setStrokeProperties" id="strokeColor">
            <option value="black" selected="selected">Black</option>
            <option value="blue">Blue</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
        </select>
    </div>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        id="svgElement"
        x="0px"
        y="0px"
        width="1200px"
        height="800px"
        viewBox="0 0 1200 800"
        enable-background="new 0 0 1200 800"
        xml:space="preserve"
    >
    </svg>
    <button @click="clear">Clear</button>
    <button @click="pan">Pan {{ panModeText }}</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Controller } from '../draw/Controller';

@Component
export default class DrawingBoard extends Vue {
  private controller!: Controller;
  private msg: string = 'Drawing board';
  private smoothness: string = '8';
  private color: string = 'black';
  private width: string = '2';
  private panMode: boolean = false;

  get panModeText() {
    return this.panMode ? 'on' : 'off';
  }

  private mounted() {
    this.controller = new Controller('svgElement');
  }

  private clear() {
    this.controller.clear();
  }

  private pan() {
    this.panMode = !this.panMode;
    this.controller.togglePanMode(this.panMode);
  }

  private setStrokeProperties() {
    this.controller.setStrokeProperties(this.color, this.smoothness, this.width);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
