import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three'
import BIRDS from 'vanta/dist/vanta.birds.min';
import 'birds.css';
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.js" integrity="sha512-NLtnLBS9Q2w7GKK9rKxdtgL7rA7CAS85uC/0xd9im4J/yOL4F9ZVlv634NAM7run8hz3wI2GabaA6vv8vJtHiQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
class MyComponent extends React.Component {
    constructor() {
      super()
      this.vantaRef = React.createRef()
    }
    componentDidMount() {
      this.vantaEffect = BIRDS({
        el: this.vantaRef.current
      })
    }
    componentWillUnmount() {
      if (this.vantaEffect) this.vantaEffect.destroy()
    }
    render() {
      return <div ref={this.vantaRef}>
        Foreground content goes here
      </div>
    }
  }
  
  ReactDOM.render(<MyComponent />, document.getElementById('birdsbg'));  