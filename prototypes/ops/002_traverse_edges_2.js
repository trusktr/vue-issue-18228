import useThreeWebGL2, { useDarkScene, useVisualDebug } from '../_lib/useThreeWebGL2.js'

import { BMesh, BMesh2, Face2, vec3, Vertex2 } from 'bmesh'
/** @import { Face } from 'bmesh' */

const cyan = 0x00ffff
const deeppink = 0xff1493
const yellow = 0xffff00
const red = 0xff0000
const orange = 0xffa500

const App = useDarkScene(useThreeWebGL2())

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Setup
const Debug = await useVisualDebug(App)
App.sphericalLook(0, 20, 6)
App.camera.position.x = 5
App.camCtrl.update()

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const bmesh = new BMesh2()
const v0 = new Vertex2(bmesh, -2, 0, -1)
const v1 = new Vertex2(bmesh, 0, 0, -1)
const v2 = new Vertex2(bmesh, 2, 0, -1)
const v3 = new Vertex2(bmesh, -2, 0, 1)
const v4 = new Vertex2(bmesh, 0, 0, 1)
const v5 = new Vertex2(bmesh, 2, 0, 1)
const v6 = new Vertex2(bmesh, 0, 1, -1)
const v7 = new Vertex2(bmesh, 0, 1, 1)

const fVerts0 = [v1, v4, v5, v2]
new Face2(bmesh, fVerts0, bmesh.edgesFromVerts(...fVerts0))
const fVerts1 = [v0, v3, v4, v1]
new Face2(bmesh, fVerts1, bmesh.edgesFromVerts(...fVerts1))
const fVerts2 = [v1, v6, v7, v4]
new Face2(bmesh, fVerts2, bmesh.edgesFromVerts(...fVerts2))

// console.log('edges:', bmesh.edgesFromVerts(...fVerts1))

// three faces
console.assert(bmesh.faces.size === 3)

// two faces share the same edge as the first face (12 - 2)
console.assert(bmesh.edges.size === 10)

// two faces share the same two vertices as the first face (12 - 4)
console.assert(bmesh.vertices.size === 8)

// Loops are unique to each face, not shared (4 * 3).
console.assert(bmesh.loops.size === 12)

let loop = [...bmesh.faces][0].loop.prev

console.log(bmesh)

render()

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
initUI()
App.renderLoop()
// App.createRenderLoop( onPreRender ).start();

function initUI() {
	document.getElementById('btnPrev').addEventListener('click', loopPrev)
	document.getElementById('btnNext').addEventListener('click', loopNext)

	document.getElementById('btnRPrev').addEventListener('click', radialPrev)
	document.getElementById('btnRNext').addEventListener('click', radialNext)
}

function render() {
	Debug.pnt.reset()
	Debug.ln.reset()

	drawMesh(bmesh)

	const a = loop.vertex.toArray()
	const b = loop.edge.otherVertex(loop.vertex).toArray()

	// TODO normals
	// const n = loop.face.normal.toArray()
	// vec3.scale(n, 0.2, n)
	// vec3.add(a, n, a)
	// vec3.add(b, n, b)

	const cssPointSize = 5 * devicePixelRatio
	Debug.pnt.addPoint(a, cyan, cssPointSize)
	Debug.ln.addPoint(a, b, cyan)

	renderFace()
}

function renderFace() {
	const avg = vec3.avg(...[...loop.radial()].map(([l]) => l.vertex.toArray()))
	const cssPointSize = 7 * devicePixelRatio
	Debug.pnt.addPoint(avg, yellow, cssPointSize, 2)
}

function loopNext() {
	loop = loop.next
	render()
}

function loopPrev() {
	loop = loop.prev
	render()
}

function radialNext() {
	loop = loop.radialLink.next.loop
	render()
}

function radialPrev() {
	loop = loop.radialLink.prev.loop
	render()
}

function drawFace(/**@type {Face2}*/ f, lineColor = deeppink) {
	// const offset = Math.random()
	const offset = 0
	for (const [l] of f.loop.radial()) {
		const cssPointSize = 5 * devicePixelRatio
		Debug.pnt.addPoint(vec3.add(l.vertex.toArray(), [offset, offset, offset]), deeppink, cssPointSize)
		Debug.ln.addPoint(
			vec3.add(l.edge.vertexA.toArray(), [offset, offset, offset]),
			vec3.add(l.edge.vertexB.toArray(), [offset, offset, offset]),
			lineColor,
		)
	}
}

function drawMesh(/**@type {BMesh2}*/ bmesh) {
	// This duplicates the rendering of shared edges and vertices.
	// let i = 0
	// for (const f of bmesh.faces) {
	// 	if (i === 0) drawFace(f, red)
	// 	if (i === 1) drawFace(f, cyan)
	// 	if (i === 2) drawFace(f, orange)
	// 	i++
	// }

	// This does not duplicate edges/vertices, and it covers non-faces too (f.e. standalone edges)
	const cssPointSize = 5 * devicePixelRatio
	for (const v of bmesh.vertices) Debug.pnt.addPoint(v.toArray(), deeppink, cssPointSize)
	for (const e of bmesh.edges) Debug.ln.addPoint(e.vertexA.toArray(), e.vertexB.toArray(), deeppink)
}

// function onPreRender( dt, et ){}
