var mouse = {x: 0, y: 0, xPrev: 0, yPrev: 0, dist: 0}
//var canvas = document.querySelector('canvas#wave-top');

const updateCanvasSize = function () {
  //document.querySelectorAll('canvas.wave').forEach(c => {
    //canvas.width = devicePixelRatio * c.getBoundingClientRect().width
    //canvas.height = devicePixelRatio * c.getBoundingClientRect().height
  //});
}

const initCanvas = function () {
  let pointsPerLine = 200
  let linesNumber = 32
  const width = document.body.getBoundingClientRect().width
  //var pixelRatio = devicePixelRatio;//4.;//Math.min(devicePixelRatio, .5);

  updateCanvasSize();




function makeReglEverything(containerSelector, vertexMainFooter) {
  let regl = createREGL({
    container: document.querySelector(containerSelector),
    pixelRatio: 1,
  });

  regl.frame(({tick, drawingBufferWidth, drawingBufferHeight, pixelRatio}) => {

    regl.clear({
      color: [1, 1, 1, 1],
      depth: 1
    })

    drawSprites({
      count: linesNumber * pointsPerLine,
      time: (new Date() / 1000) % (3600 * 24),
      u_mouse: [mouse.x / width, mouse.y / 500],
      mouseDist: mouse.dist,
    })
  })

  let drawSprites = regl({
  vert: `
  precision highp float;
  attribute float id;
  varying vec2 uv;
  varying float color;
  varying float opacity;
  uniform float pointsPerLine;
  uniform float linesNumber;
  uniform float u_time;
  uniform float mouseDist;
  uniform vec2 u_mouse;
      vec2 polarToDecart(vec2 polar) {
        float alpha = polar.x;
        float R = polar.y;
        float x = sin(alpha) * R;
        float y = cos(alpha) * R;
        return vec2(x, y);
      }
      vec2 decartToPolar(vec2 decart) {
        float alpha = atan(decart.x, decart.y);
        float R = length(decart);
        return vec2(alpha, R);
      }
      vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      vec4 permute(vec4 x) {
        return mod289(((x*34.0)+1.0)*x);
      }
      vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
      }
      float snoise(vec3 v) { 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 =   v - i + dot(i, C.xxx) ;
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i); 
        vec4 p = permute( permute( permute( 
          i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 0.142857142857; // 1.0/7.0
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
          dot(p2,x2), dot(p3,x3) ) );
      }
      ${vertexMainFooter}
    `,
      frag: `
    precision highp float;
    varying vec2 uv;
    varying float color;
    varying float opacity;
    void main () {
      vec3 teal = vec3(0.,165.,186.)/256.;
      vec3 yellow = vec3(247.,198.,4.)/256.;
      vec3 red = vec3(255.,0.,0.)/256.;
      gl_FragColor.rgb = mix(yellow, red, fract(color*2.)) * step(1./2., color);
      gl_FragColor.rgb += mix(teal, yellow, fract(color*2.)) * (1.-step(1./2., color));
      gl_FragColor.a = 1.;
      gl_FragColor = mix(gl_FragColor, vec4(1), opacity);
    }`,
    attributes: {
      id: Array(linesNumber * pointsPerLine).fill(0).map((d, i) => i),
    },
    uniforms: {
      linesNumber: linesNumber,
      pointsPerLine: pointsPerLine,
      u_time: regl.prop('time'),
      u_mouse: regl.prop('u_mouse'),
      mouseDist: regl.prop('mouseDist'),
    },
    primitive: 'triangle strip',
    elements: null,
    count: pointsPerLine * linesNumber,
  })

  return regl
}


let vertexMainHero = `
  void main () {
  float i = id;

  float m = mod(i, pointsPerLine);
  if (m<=1. || m >= pointsPerLine-2.) {
    gl_Position=vec4(-1, 1, 0, 1);
    return;
  }

  float angle = mod(floor(i/2.)*2., pointsPerLine) / (pointsPerLine-1.) * .5 * 3.1415 + .5*3.1415;
  float ringIndex = floor(i/pointsPerLine);
  float ringIndexNorm = ringIndex / linesNumber;
  float lineWidth = mix(.008, .001, ringIndexNorm);
  float amp = 1.; //mix(.5, .2, ringIndexNorm);
  float radiusMax = 1.9;
  float radius = radiusMax; //mix(radiusMax, radiusMax-.2, ringIndexNorm);

  float n = snoise(vec3(
    angle * 1.3, 
    ringIndexNorm * .5 - u_time * .1 - mouseDist * .04, 
    mouseDist * .02)) * .4 + .5;
  radius -= n * amp;

  color = mix(0., 1., n*2.-.8);
  color = clamp(color, 0., 1.);
  opacity = pow(ringIndex / linesNumber, .8);


  bool isBottomPoint = mod(i, 2.) == 0.;
  if(isBottomPoint) {
    radius-=lineWidth;
  }
  vec2 uv = polarToDecart(vec2(angle, radius));
  uv.x-=1.05;
  uv.y+=1.05;


  gl_Position = vec4(uv, 0, 1);
  }
  `
let vertexMainFooter = `
  void main () {
  float i = id;
  float x = mod(floor(i/2.)*2., pointsPerLine) / (pointsPerLine-1.) * 2.2 - 1.1;

  float m = mod(i, pointsPerLine);
  if (m<=1. || m >= pointsPerLine-2.) {
    gl_Position=vec4(x, 1, 0, 1);
    return;
  }

  float lineIndex = floor(i/pointsPerLine);
  float lineIndexNorm = lineIndex / linesNumber;
  float lineWidth = mix(.02, .005, lineIndexNorm);
  float amp = .7; //mix(.5, .2, lineIndexNorm);
  float offsetMax = 0.;
  float y = offsetMax; //mix(offsetMax, offsetMax-.2, lineIndexNorm);

  float n = snoise(vec3(
    x * 1.3, 
    lineIndexNorm * .5 - u_time * .1 - mouseDist * .04, 
    mouseDist * .02)) * .9;
  y += n * amp;

  color = mix(0., 1., n);
  color = clamp(color, 0., 1.);
  opacity = pow(lineIndex / linesNumber, .8);


  bool isBottomPoint = mod(i, 2.) == 0.;
  if(isBottomPoint) {
    y-=lineWidth;
    //x = mod(i-1., pointsPerLine) / (pointsPerLine-1.) * 2.2 - 1.1;
  }
  vec2 uv = vec2(x, y);
  //if(mod(i, 3.) == 0.) uv = vec2(0, 0);
  //if(mod(i, 3.) == 1.) uv = vec2(-1, -1);


  gl_Position = vec4(uv, 0, 1);
  }
  `
  document.getElementById("wave-top") && makeReglEverything('#wave-top', vertexMainHero)
  document.getElementById('wave-bottom') && makeReglEverything('#wave-bottom', vertexMainFooter)
  

}

document.addEventListener("DOMContentLoaded", initCanvas);


document.addEventListener('mousemove', e => {
  let movement = Math.hypot(mouse.x - mouse.xPrev, mouse.y - mouse.yPrev)
  mouse.xPrev = mouse.x
  mouse.yPrev = mouse.y
  mouse.dist += movement * .01;
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('resize', updateCanvasSize);
