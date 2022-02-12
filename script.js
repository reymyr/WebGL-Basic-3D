"use strict";

var vertices = [
  vec3( -0.5, -0.5,  0.5 ),
  vec3( -0.5,  0.5,  0.5 ),
  vec3(  0.5,  0.5,  0.5 ),
  vec3(  0.5, -0.5,  0.5 ),
  vec3( -0.5, -0.5, -0.5 ),
  vec3( -0.5,  0.5, -0.5 ),
  vec3(  0.5,  0.5, -0.5 ),
  vec3(  0.5, -0.5, -0.5 )
];

var vertexColors = [
  [ 0.0, 0.0, 0.0, 1.0 ],  // black
  [ 1.0, 0.0, 0.0, 1.0 ],  // red
  [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
  [ 0.0, 1.0, 0.0, 1.0 ],  // green
  [ 0.0, 0.0, 1.0, 1.0 ],  // blue
  [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
  [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
  [ 1.0, 1.0, 1.0, 1.0 ]   // white
]; 

var canvas, gl, program;
var numVertices  = 36;
var points = [];
var colors = [];
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta = [ 0, 0, 0 ];
var modelView;

function quad(a, b, c, d) {
  var indices = [ a, b, c, a, c, d ];

  for (var i = 0; i < indices.length; ++i ) {
    points.push(vertices[indices[i]]);
    colors.push(vertexColors[indices[i]]);
  }
}

function colorCube() {
  quad(0,3,2,1);
  quad(2,3,7,6);
  quad(0,4,7,3);
  quad(1,2,6,5);
  quad(4,5,6,7);
  quad(0,1,5,4);
}


window.onload = function init(){
  canvas = document.getElementById( "canvas" ); 
  gl = WebGLUtils.setupWebGL( canvas );   

  colorCube();  
  
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
  gl.enable(gl.DEPTH_TEST);

  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  var vBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

  var cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
  var vPosition = gl.getAttribLocation(program, "a_position");
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  var colorLocation = gl.getAttribLocation(program, "a_color");
  gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorLocation);
  
  document.getElementById( "xButton" ).onclick = function () { axis = xAxis; };
  document.getElementById( "yButton" ).onclick = function () { axis = yAxis; };
  document.getElementById( "zButton" ).onclick = function () { axis = zAxis; };
  
  render()
}

function render(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  theta[axis] += 2.0;
  modelView = mat4();
  modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
  modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
  modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));
  gl.uniformMatrix4fv( gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView) );

  gl.drawArrays( gl.TRIANGLES, 0, numVertices );
  requestAnimFrame( render );
}