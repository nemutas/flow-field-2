import * as THREE from 'three'
import { RawShaderMaterial } from './core/ExtendedMaterials'
import { Three } from './core/Three'
import { Simulator } from './Simulator'
import vertexShader from './shader/point.vs'
import fragmentShader from './shader/point.fs'

export class Canvas extends Three {
  private simulator: Simulator
  private points: THREE.Points<THREE.BufferGeometry, RawShaderMaterial>

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)

    this.init()

    this.simulator = new Simulator(this.renderer, [512 * 2, 512 * 2])

    this.points = this.createPoints()
    window.addEventListener('resize', this.resize.bind(this))
    this.renderer.setAnimationLoop(this.anime.bind(this))
  }

  private init() {
    this.scene.background = new THREE.Color('#000')
  }

  private createPoints() {
    const geo = new THREE.BufferGeometry()

    const positions: number[] = []
    const uvs: number[] = []

    for (let ix = 0; ix < this.simulator.size.width; ix++) {
      for (let iy = 0; iy < this.simulator.size.height; iy++) {
        positions.push(0, 0, 0)
        uvs.push(ix / this.simulator.size.width, iy / this.simulator.size.height)
      }
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))

    const mat = new RawShaderMaterial({
      uniforms: {
        tSim: { value: null },
        uResolution: { value: [this.size.width, this.size.height] },
      },
      vertexShader,
      fragmentShader,
      glslVersion: '300 es',
      transparent: true,
      depthWrite: false,
      depthTest: false,
    })

    const points = new THREE.Points(geo, mat)
    this.scene.add(points)

    return points
  }

  resize() {
    this.points.material.uniforms.uResolution.value = [this.size.width, this.size.height]
    this.simulator.resize()
  }

  private anime() {
    this.updateTime()

    this.simulator.render(this.time.delta)
    this.points.material.uniforms.tSim.value = this.simulator.texture

    this.render()
  }
}
