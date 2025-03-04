//#region IMPORTS
import useThreeWebGL2, { useDarkScene, useVisualDebug } from '../_lib/useThreeWebGL2.js';

import { BMesh, vec3 } from 'bmesh';
//#endregion

//#region MAIN
let App   = useDarkScene( useThreeWebGL2() );
let Ref   = {
    loop : null,
};
let Debug;

window.addEventListener( 'load', async _=>{
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Setup
    Debug = await useVisualDebug( App );
    App.sphericalLook( 0, 20, 6 );
    
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const mesh  = new BMesh();
    const v0    = mesh.addVertex( [-2,0,-1] );
    const v1    = mesh.addVertex( [ 0,0,-1] );
    const v2    = mesh.addVertex( [ 2,0,-1] );
    const v3    = mesh.addVertex( [-2,0, 1] );
    const v4    = mesh.addVertex( [ 0,0, 1] );
    const v5    = mesh.addVertex( [ 2,0, 1] );

    const v6    = mesh.addVertex( [ 0,1, -1] );
    const v7    = mesh.addVertex( [ 0,1, 1] );

    const f1    = mesh.addFace( [ v1, v4, v5, v2 ] );
    const f0    = mesh.addFace( [ v0, v3, v4, v1 ] );
    const f2    = mesh.addFace( [ v1, v6, v7, v4 ] );

    Ref.mesh    = mesh;
    // drawFace( f0 );
    // drawFace( f1 );

    console.log( mesh );

    Ref.loop = mesh.faces[ 0 ].loop.prev;
    // Ref.loop = mesh.faces[ mesh.faces.length-1 ].loop;

    render();

    // drawFace( mesh.faces[0] );

    // for( const v of mesh.vertices ) Debug.pnt.addPoint( v.pos, 0x00ff00, 3 );
    // for( const e of mesh.edges )    Debug.ln.addPoint( e.v1.pos, e.v2.pos, 0x00ffff );
    // iterVertEdges( v1 );
    
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    initUI();
    App.renderLoop();
    // App.createRenderLoop( onPreRender ).start();
});

function initUI(){
    document.getElementById( 'btnPrev' ).addEventListener( 'click', loopPrev );
    document.getElementById( 'btnNext' ).addEventListener( 'click', loopNext );

    document.getElementById( 'btnRPrev' ).addEventListener( 'click', loopRPrev );
    document.getElementById( 'btnRNext' ).addEventListener( 'click', loopRNext );
}

function render(){
    Debug.pnt.reset();
    Debug.ln.reset();

    const mesh = Ref.mesh;

    for( const v of mesh.vertices ) Debug.pnt.addPoint( v.pos, 0x00ff00, 3 );
    for( const e of mesh.edges )    Debug.ln.addPoint( e.v1.pos, e.v2.pos, 0x00ffff );

    const loop = Ref.loop;

    const a = loop.vert.pos.slice(); // loop.edge.v1.pos.slice();
    const b = ( loop.vert === loop.edge.v1 )
                    ? loop.edge.v2.pos.slice()
                    : loop.edge.v1.pos.slice();

    const n = loop.face.norm.slice();
    vec3.scale( n, 0.2, n );
    vec3.add( a, n, a );
    vec3.add( b, n, b );

    Debug.pnt.addPoint( a, 0xffff00, 4 );
    Debug.ln.addPoint( a, b, 0xffff00 );
    renderFace();
}

function renderFace(){
    let iter = Ref.loop;
    let x    = 0;
    let y    = 0;
    let z    = 0;
    let cnt  = 0;
    do{
        x += iter.vert.pos[0];
        y += iter.vert.pos[1];
        z += iter.vert.pos[2];
        cnt++;
    } while( ( iter = iter.next ) != Ref.loop );

    x /= cnt;
    y /= cnt;
    z /= cnt;

    Debug.pnt.addPoint( [x,y,z], 0xffff00, 5, 2 );
}

function loopNext(){
    Ref.loop = Ref.loop.next;
    render();
}

function loopPrev(){
    Ref.loop = Ref.loop.prev;
    render();
}

function loopRPrev(){
    Ref.loop = Ref.loop.radial_prev;
    render();
}

function loopRNext(){
    Ref.loop = Ref.loop.radial_next;
    render();
}

// function onPreRender( dt, et ){}
//#endregion