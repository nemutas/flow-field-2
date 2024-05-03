import * as THREE from 'three'

import { BackBuffer } from './core/BackBuffer'
import { RawShaderMaterial } from './core/ExtendedMaterials'
import vertexShader from './shader/quad.vs'
import fragmentShader from './shader/sim.fs'

export class Simulator extends BackBuffer {
  constructor(renderer: THREE.WebGLRenderer, size: [number, number]) {
    const material = new RawShaderMaterial({
      uniforms: {
        tBackBuffer: { value: null },
        uTime: { value: 0 },
        uDeltaTime: { value: 0 },
        uFrame: { value: 0 },
        uResolution: { value: [renderer.domElement.width, renderer.domElement.height] },
      },
      vertexShader,
      fragmentShader,
      glslVersion: '300 es',
    })
    super(renderer, material, { size, dpr: 1, renderTargetOptions: { type: THREE.FloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter } })
  }

  resize() {
    this.uniforms.uResolution.value = [this.renderer.domElement.width, this.renderer.domElement.height]
  }

  render(dt: number) {
    this.uniforms.tBackBuffer.value = this.backBuffer
    this.uniforms.uTime.value += dt
    this.uniforms.uDeltaTime.value = dt
    this.uniforms.uFrame.value += 1
    super.render()
  }
}
