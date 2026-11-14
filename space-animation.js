(function () {
  'use strict';
  
  function startSpaceAnimation() {
    try {
      var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        return;
      }

      var hero = document.querySelector('.hero-section');
      if (!hero || typeof THREE === 'undefined') {
        return;
      }

      var canvas = document.getElementById('space-canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'space-canvas';
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', 'Space background animation');
        hero.insertBefore(canvas, hero.firstChild);
      }

      var renderer;
      try {
        renderer = new THREE.WebGLRenderer({ 
          canvas: canvas, 
          antialias: true, 
          alpha: true, 
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false
        });
      } catch (e) {
        console.warn('WebGL not available, falling back to canvas:', e);
        return;
      }
      
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  camera.position.set(0, 0.7, 9);

  scene.add(new THREE.AmbientLight(0x9fc4e8, 0.75));
  var sun = new THREE.DirectionalLight(0xfff6e8, 1.5);
  sun.position.set(-8, 5, 3);
  scene.add(sun);
  var rimLight = new THREE.DirectionalLight(0x67e8f9, 0.5);
  rimLight.position.set(-12, -6, -5);
  scene.add(rimLight);
  
  // Add extra point lights for more dynamic 3D effect
  var pointLight1 = new THREE.PointLight(0x67e8f9, 0.4, 100);
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);
  
  var pointLight2 = new THREE.PointLight(0xff9a56, 0.3, 80);
  pointLight2.position.set(-15, -8, 5);
  scene.add(pointLight2);

  function radialGlowTexture() {
    var c = document.createElement('canvas');
    c.width = c.height = 128;
    var x = c.getContext('2d');
    var g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.4)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  var glowTex = radialGlowTexture();

  function makeStars() {
    var count = 600;
    if (window.innerWidth < 768) {
      count = 220;
    } else if (window.innerWidth < 1280) {
      count = 420;
    }
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
      count = Math.min(count, 320);
    }
    var pos = new Float32Array(count * 3);
    var size = new Float32Array(count);
    var phase = new Float32Array(count);
    var color = new Float32Array(count * 3);
    
    // Color palette for realistic stars
    var colors = [
      [1.0, 1.0, 1.0],     // White
      [0.9, 0.95, 1.0],    // Bluish white
      [1.0, 0.95, 0.85],   // Yellowish
      [0.8, 0.95, 1.0],    // Light blue
      [1.0, 0.98, 0.9]     // Warm white
    ];
    
    for (var i = 0; i < count; i++) {
      var r = 30 + Math.random() * 70;
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      // Variable star sizes for depth
      size[i] = 0.4 + Math.random() * 2.2;
      phase[i] = Math.random();
      
      // Assign random colors
      var col = colors[Math.floor(Math.random() * colors.length)];
      color[i * 3] = col[0];
      color[i * 3 + 1] = col[1];
      color[i * 3 + 2] = col[2];
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(color, 3));
    var mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xbfd4f5) }
      },
      vertexShader: [
        'attribute float aSize;',
        'attribute float aPhase;',
        'attribute vec3 aColor;',
        'uniform float uTime;',
        'varying float vTw;',
        'varying vec3 vColor;',
        'void main() {',
        '  float tw = 0.5 + 0.5 * sin(uTime * 0.4 + aPhase * 6.28318);',
        '  vTw = tw;',
        '  vColor = aColor;',
        '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
        '  gl_PointSize = (aSize + 0.3) * tw * (180.0 / -mv.z);',
        '  gl_Position = projectionMatrix * mv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying float vTw;',
        'varying vec3 vColor;',
        'void main() {',
        '  vec2 uv = gl_PointCoord - 0.5;',
        '  float d = length(uv);',
        '  float a = smoothstep(0.5, 0.02, d) * vTw;',
        '  if (a < 0.02) discard;',
        '  gl_FragColor = vec4(vColor, a * 0.9);',
        '}'
      ].join('\n'),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    return new THREE.Points(geo, mat);
  }
  var stars = makeStars();
  scene.add(stars);

  function makeNebula() {
    var c = document.createElement('canvas');
    c.width = c.height = 1024;
    var x = c.getContext('2d');
    x.fillStyle = '#000';
    x.fillRect(0, 0, 1024, 1024);
    var palette = [
      [196, 228, 255, 0.08],  // Light blue
      [94, 234, 212, 0.07],   // Cyan
      [125, 165, 255, 0.08],  // Blue
      [138, 126, 222, 0.06],  // Purple
      [147, 197, 253, 0.07]   // Sky blue
    ];
    
    // Create more nebula clouds for better depth
    for (var i = 0; i < 45; i++) {
      var px = 512 + (Math.random() - 0.5) * 600;
      var py = 512 + (Math.random() - 0.5) * 600;
      var rad = 40 + Math.random() * 180;
      var col = palette[i % palette.length];
      var g = x.createRadialGradient(px, py, 0, px, py, rad);
      g.addColorStop(0, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + col[3] + ')');
      g.addColorStop(0.6, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (col[3] * 0.3) + ')');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g;
      x.fillRect(px - rad, py - rad, rad * 2, rad * 2);
    }
    
    // Add multiple nebula layers at different positions for depth
    var materials = [];
    for (var l = 0; l < 3; l++) {
      var mat = new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(c),
        transparent: true,
        opacity: 0.16 + l * 0.06,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      var s = new THREE.Sprite(mat);
      s.scale.set(50 + l * 8, 50 + l * 8, 1);
      s.position.set(l * 2 - 2, l * 1.5 - 1.5, -12 - l * 2);
      s.rotation.z = (Math.PI * 2 * l) / 3;
      scene.add(s);
    }
  }

  function atmosphereMaterial(colorHex, power) {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(colorHex) },
        uPower: { value: power }
      },
      vertexShader: [
        'varying vec3 vN;',
        'varying vec3 vV;',
        'void main() {',
        '  vN = normalize(normalMatrix * normal);',
        '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
        '  vV = -mv.xyz;',
        '  gl_Position = projectionMatrix * mv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uColor;',
        'uniform float uPower;',
        'varying vec3 vN;',
        'varying vec3 vV;',
        'void main() {',
        '  float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uPower);',
        '  gl_FragColor = vec4(uColor, f * 0.85);',
        '}'
      ].join('\n'),
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }

  function seeded(seed) {
    var s = seed;
    return function () {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  function earthTexture() {
    var w = 1024, h = 512;
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    var x = c.getContext('2d');
    var g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#0a3a66');
    g.addColorStop(0.5, '#11528a');
    g.addColorStop(1, '#0a3a66');
    x.fillStyle = g;
    x.fillRect(0, 0, w, h);
    for (var i = 0; i < 4200; i++) {
      x.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.06)';
      x.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }
    var r = seeded(42);
    var land = ['#4e8c4e', '#3f7a45', '#6b8f4f', '#8a7f57', '#5d8a52'];
    for (var k = 0; k < 13; k++) {
      var cx = r() * w;
      var cy = h * 0.18 + r() * h * 0.64;
      var col = land[Math.floor(r() * land.length)];
      x.fillStyle = col;
      for (var s = 0; s < 70; s++) {
        var a = (s / 70) * Math.PI * 2 + r() * 0.35;
        var rad = (22 + r() * 60) * (1 + 0.35 * Math.sin(r() * 13));
        var px = cx + Math.cos(a) * rad * 1.7;
        var py = cy + Math.sin(a) * rad;
        x.globalAlpha = 0.85;
        x.beginPath();
        x.arc(px, py, rad * 0.26, 0, Math.PI * 2);
        x.fill();
      }
      x.globalAlpha = 1;
      for (var d = 0; d < 140; d++) {
        x.fillStyle = col;
        x.globalAlpha = 0.45;
        x.fillRect(cx + (r() - 0.5) * 170, cy + (r() - 0.5) * 110, 3, 3);
      }
      x.globalAlpha = 1;
    }
    var ice = x.createLinearGradient(0, 0, 0, 34);
    ice.addColorStop(0, 'rgba(240,250,255,1)');
    ice.addColorStop(1, 'rgba(240,250,255,0)');
    x.fillStyle = ice;
    x.fillRect(0, 0, w, 34);
    var ice2 = x.createLinearGradient(0, h, 0, h - 34);
    ice2.addColorStop(0, 'rgba(240,250,255,1)');
    ice2.addColorStop(1, 'rgba(240,250,255,0)');
    x.fillStyle = ice2;
    x.fillRect(0, h - 34, w, 34);
    var t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    return t;
  }

  function cloudTexture() {
    var w = 1024, h = 512;
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    var x = c.getContext('2d');
    var r = seeded(7);
    for (var i = 0; i < 170; i++) {
      var px = r() * w;
      var py = h * 0.15 + r() * h * 0.7;
      var rad = 9 + r() * 48;
      var g = x.createRadialGradient(px, py, 0, px, py, rad);
      g.addColorStop(0, 'rgba(255,255,255,' + (0.1 + r() * 0.3) + ')');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g;
      x.beginPath();
      x.arc(px, py, rad, 0, Math.PI * 2);
      x.fill();
    }
    x.globalAlpha = 0.16;
    x.fillStyle = '#fff';
    for (var s = 0; s < 26; s++) {
      x.fillRect(0, r() * h, w, 1 + r() * 2);
    }
    return new THREE.CanvasTexture(c);
  }

  function planetTexture() {
    var s = 512;
    var c = document.createElement('canvas');
    c.width = c.height = s;
    var x = c.getContext('2d');
    var base = x.createLinearGradient(0, 0, 0, s);
    base.addColorStop(0, '#102f44');
    base.addColorStop(0.5, '#1b5570');
    base.addColorStop(1, '#102f44');
    x.fillStyle = base;
    x.fillRect(0, 0, s, s);
    var r = seeded(21);
    for (var i = 0; i < 90; i++) {
      var y = r() * s;
      var hgt = 1 + r() * 14;
      x.fillStyle = 'rgba(' + Math.floor(90 + r() * 60) + ',' + Math.floor(160 + r() * 60) + ',' + Math.floor(190 + r() * 40) + ',' + (0.03 + r() * 0.1) + ')';
      x.fillRect(0, y, s, hgt);
    }
    for (var j = 0; j < 6; j++) {
      var ox = s * 0.2 + r() * s * 0.6;
      var oy = s * 0.25 + r() * s * 0.5;
      var rad = 14 + r() * 32;
      var g = x.createRadialGradient(ox, oy, 0, ox, oy, rad);
      g.addColorStop(0, 'rgba(235,248,255,0.3)');
      g.addColorStop(1, 'rgba(235,248,255,0)');
      x.fillStyle = g;
      x.fillRect(ox - rad, oy - rad, rad * 2, rad * 2);
    }
    return new THREE.CanvasTexture(c);
  }

  function sunTexture() {
    var s = 256;
    var c = document.createElement('canvas');
    c.width = c.height = s;
    var x = c.getContext('2d');
    var g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, '#fff7e0');
    g.addColorStop(0.55, '#ffe9b3');
    g.addColorStop(1, '#ffd97a');
    x.fillStyle = g;
    x.fillRect(0, 0, s, s);
    return new THREE.CanvasTexture(c);
  }

  function rockyTexture() {
    var s = 256;
    var c = document.createElement('canvas');
    c.width = c.height = s;
    var x = c.getContext('2d');
    var base = x.createLinearGradient(0, 0, 0, s);
    base.addColorStop(0, '#7a4a3a');
    base.addColorStop(0.5, '#a06a4a');
    base.addColorStop(1, '#6b4030');
    x.fillStyle = base;
    x.fillRect(0, 0, s, s);
    var r = seeded(55);
    for (var i = 0; i < 420; i++) {
      var px = r() * s;
      var py = r() * s;
      var rad = 1 + r() * 4;
      x.fillStyle = 'rgba(' + Math.floor(60 + r() * 80) + ',' + Math.floor(40 + r() * 60) + ',' + Math.floor(30 + r() * 40) + ',' + (0.15 + r() * 0.3) + ')';
      x.beginPath();
      x.arc(px, py, rad, 0, Math.PI * 2);
      x.fill();
    }
    return new THREE.CanvasTexture(c);
  }

  function paleTexture() {
    var s = 256;
    var c = document.createElement('canvas');
    c.width = c.height = s;
    var x = c.getContext('2d');
    var base = x.createLinearGradient(0, 0, 0, s);
    base.addColorStop(0, '#46627a');
    base.addColorStop(0.5, '#7fa5bd');
    base.addColorStop(1, '#3f5a70');
    x.fillStyle = base;
    x.fillRect(0, 0, s, s);
    var r = seeded(99);
    for (var i = 0; i < 300; i++) {
      var px = r() * s;
      var py = r() * s;
      var rad = 2 + r() * 6;
      x.fillStyle = 'rgba(' + Math.floor(150 + r() * 70) + ',' + Math.floor(175 + r() * 60) + ',' + Math.floor(200 + r() * 45) + ',' + (0.1 + r() * 0.22) + ')';
      x.beginPath();
      x.arc(px, py, rad, 0, Math.PI * 2);
      x.fill();
    }
    return new THREE.CanvasTexture(c);
  }

  var earthPos = new THREE.Vector3(-5.2, -1.0, 0.5);
  var planetPos = new THREE.Vector3(5.2, -0.6, 0.5);

  var earth = new THREE.Mesh(
    new THREE.SphereGeometry(2.1, 28, 28),
    new THREE.MeshStandardMaterial({ map: earthTexture(), roughness: 0.85, metalness: 0.05 })
  );
  earth.position.copy(earthPos);

  var clouds = new THREE.Mesh(
    new THREE.SphereGeometry(2.12, 24, 24),
    new THREE.MeshStandardMaterial({ map: cloudTexture(), transparent: true, opacity: 0.85, roughness: 1, depthWrite: false })
  );
  clouds.position.copy(earthPos);

  var atmo = new THREE.Mesh(new THREE.SphereGeometry(2.25, 24, 24), atmosphereMaterial(0x4fc3f7, 3.4));
  atmo.position.copy(earthPos);

  var earthGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x2f6fbf, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }));
  earthGlow.scale.set(8.6, 8.6, 1);
  earthGlow.position.copy(earthPos);
  scene.add(earth, clouds, atmo, earthGlow);

  var planet = new THREE.Mesh(
    new THREE.SphereGeometry(1.15, 26, 26),
    new THREE.MeshStandardMaterial({ map: planetTexture(), roughness: 0.8, metalness: 0.08 })
  );
  planet.position.copy(planetPos);

  var patmo = new THREE.Mesh(new THREE.SphereGeometry(1.32, 20, 20), atmosphereMaterial(0x5eead4, 4.2));
  patmo.position.copy(planetPos);

  var ringMat = new THREE.ShaderMaterial({
    vertexShader: [
      'varying float vR;',
      'void main() {',
      '  vR = (length(position.xz) - 1.7) / (2.3 - 1.7);',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
      '}'
    ].join('\n'),
    fragmentShader: [
      'varying float vR;',
      'void main() {',
      '  float a = smoothstep(0.0, 0.35, vR) * (1.0 - smoothstep(0.55, 1.0, vR));',
      '  gl_FragColor = vec4(vec3(0.72, 0.93, 1.0), a * 0.5);',
      '}'
    ].join('\n'),
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  var ring = new THREE.Mesh(new THREE.RingGeometry(1.7, 2.3, 72), ringMat);
  ring.position.copy(planetPos);
  ring.rotation.set(1.15, 0.3, 0.15);

  var planetGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x0d9488, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false }));
  planetGlow.scale.set(5.1, 5.1, 1);
  planetGlow.position.copy(planetPos);
  scene.add(planet, patmo, ring, planetGlow);

  var sunPos = new THREE.Vector3(-6.3, 3.6, -2.5);
  var sunMesh = new THREE.Mesh(new THREE.SphereGeometry(1.3, 40, 40), new THREE.MeshBasicMaterial({ map: sunTexture() }));
  sunMesh.position.copy(sunPos);
  var sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffe9b8, transparent: true, opacity: 0.27, blending: THREE.AdditiveBlending, depthWrite: false }));
  sunGlow.scale.set(11.5, 11.5, 1);
  sunGlow.position.copy(sunPos);
  var sunCorona = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffd97a, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false }));
  sunCorona.scale.set(18, 18, 1);
  sunCorona.position.copy(sunPos);
  scene.add(sunMesh, sunGlow, sunCorona);

  var rockyPos = new THREE.Vector3(5.4, 3.7, -3.5);
  var rocky = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 32), new THREE.MeshStandardMaterial({ map: rockyTexture(), roughness: 1, metalness: 0 }));
  rocky.position.copy(rockyPos);
  var rockyAtmo = new THREE.Mesh(new THREE.SphereGeometry(0.64, 28, 28), atmosphereMaterial(0xe0a06b, 5.5));
  rockyAtmo.position.copy(rockyPos);
  scene.add(rocky, rockyAtmo);

  var palePos = new THREE.Vector3(8.0, 1.4, -6);
  var pale = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({ map: paleTexture(), roughness: 0.9, metalness: 0.05 }));
  pale.position.copy(palePos);
  var paleAtmo = new THREE.Mesh(new THREE.SphereGeometry(0.58, 28, 28), atmosphereMaterial(0x9ecbff, 5));
  paleAtmo.position.copy(palePos);
  scene.add(pale, paleAtmo);

  var dwarfPos = new THREE.Vector3(-8.4, -1.0, -7);
  var dwarf = new THREE.Mesh(new THREE.SphereGeometry(0.34, 28, 28), new THREE.MeshStandardMaterial({ color: 0x9aa7b5, roughness: 1, metalness: 0 }));
  dwarf.position.copy(dwarfPos);
  scene.add(dwarf);

  function makeCraft() {
    var g = new THREE.Group();
    var silver = new THREE.MeshStandardMaterial({ color: 0xe8eef5, metalness: 0.85, roughness: 0.28 });
    var dark = new THREE.MeshStandardMaterial({ color: 0x0b3d91, metalness: 0.7, roughness: 0.35 });
    var teal = new THREE.MeshStandardMaterial({ color: 0x155e75, metalness: 0.4, roughness: 0.4 });

    var body = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 0.28, 14), silver);
    body.rotation.x = Math.PI / 2;
    g.add(body);

    var nose = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 10), silver);
    nose.position.set(0, 0, 0.16);
    g.add(nose);

    var tail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.1, 12), dark);
    tail.rotation.x = Math.PI / 2;
    tail.position.set(0, 0, -0.18);
    g.add(tail);

    var panelGeo = new THREE.BoxGeometry(0.42, 0.2, 0.015);
    var p1 = new THREE.Mesh(panelGeo, dark);
    p1.position.set(0.27, 0, 0.02);
    var p2 = new THREE.Mesh(panelGeo, dark);
    p2.position.set(-0.27, 0, 0.02);
    g.add(p1, p2);

    var mast = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8), silver);
    mast.position.set(0, 0.07, -0.02);
    g.add(mast);

    var sensor = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 8), teal);
    sensor.position.set(0, 0.13, -0.02);
    g.add(sensor);

    var dish = new THREE.Mesh(new THREE.CircleGeometry(0.05, 16), silver);
    dish.position.set(0, 0.005, 0.19);
    g.add(dish);

    var thruster = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x67e8f9, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
    thruster.position.set(0, 0, -0.24);
    thruster.scale.set(0.22, 0.22, 1);
    g.add(thruster);

    var halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x7dd3fc, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }));
    halo.scale.set(0.55, 0.55, 1);
    g.add(halo);

    g.scale.set(1, 1, 1);
    return g;
  }
  var craft = makeCraft();
  scene.add(craft);

  var TRAIL_N = 80;
  var trailPos = new Float32Array(TRAIL_N * 3);
  var trailCol = new Float32Array(TRAIL_N * 3);
  var trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
  trailGeo.setAttribute('color', new THREE.BufferAttribute(trailCol, 3));
  var trailMat = new THREE.PointsMaterial({
    size: 0.14,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  var trail = new THREE.Points(trailGeo, trailMat);
  scene.add(trail);

  var history = [];

  function updateTrail(pos) {
    history.unshift(pos.clone());
    if (history.length > TRAIL_N) history.pop();
    for (var i = 0; i < TRAIL_N; i++) {
      var idx = Math.min(i, history.length - 1);
      var p = history[idx];
      trailPos[i * 3] = p.x;
      trailPos[i * 3 + 1] = p.y;
      trailPos[i * 3 + 2] = p.z;
      var f = 1 - i / TRAIL_N;
      var b = f * f;
      trailCol[i * 3] = 0.35 * b;
      trailCol[i * 3 + 1] = 0.95 * b;
      trailCol[i * 3 + 2] = 1.0 * b;
    }
    trailGeo.attributes.position.needsUpdate = true;
    trailGeo.attributes.color.needsUpdate = true;
  }

  var A = new THREE.Vector3(-3.12, 0.2, 0.6);
  var B = new THREE.Vector3(4.033, 0.567, 0.6);
  var outCurve = new THREE.CatmullRomCurve3([
    A,
    new THREE.Vector3(-1.2, 2.3, 0.5),
    new THREE.Vector3(0.3, 3.2, 0.4),
    new THREE.Vector3(1.8, 2.3, 0.5),
    B
  ]);

  var R_ORBIT = 1.65;
  var THETA0 = Math.PI * 0.75;

  var routePts = outCurve.getPoints(90);
  for (var ai = 0; ai <= 120; ai++) {
    var ang = THETA0 + (ai / 120) * Math.PI * 2;
    routePts.push(new THREE.Vector3(
      planetPos.x + R_ORBIT * Math.cos(ang),
      planetPos.y + R_ORBIT * Math.sin(ang),
      planetPos.z + 0.05 * Math.sin(ang * 2)
    ));
  }
  var routeLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(routePts),
    new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  scene.add(routeLine);

  var T_LOOP = 40;

  function easeInOut(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function pose(elapsed) {
    var t = ((elapsed % T_LOOP) + T_LOOP) % T_LOOP;
    var pos = new THREE.Vector3();
    var dir = new THREE.Vector3();
    var orbiting = false;
    if (t < 4) {
      var u = t / 4;
      var bob = 0.5 - 0.5 * Math.cos(u * Math.PI * 2);
      pos.copy(A);
      pos.y += bob * 0.03;
      pos.z += bob * 0.02;
      dir.copy(outCurve.getTangentAt(0.0));
    } else if (t < 17) {
      var u = (t - 4) / 13;
      var s = easeInOut(u);
      pos.copy(outCurve.getPointAt(s));
      dir.copy(outCurve.getTangentAt(s));
    } else if (t < 22) {
      orbiting = true;
      var u = (t - 17) / 5;
      var ang = THETA0 + easeInOut(u) * Math.PI * 2;
      pos.set(
        planetPos.x + R_ORBIT * Math.cos(ang),
        planetPos.y + R_ORBIT * Math.sin(ang),
        planetPos.z + 0.05 * Math.sin(ang * 2)
      );
      dir.set(-Math.sin(ang), Math.cos(ang), 0).normalize();
    } else if (t < 35) {
      var u = (t - 22) / 13;
      var s = 1 - easeInOut(u);
      pos.copy(outCurve.getPointAt(s));
      dir.copy(outCurve.getTangentAt(s)).negate();
    } else {
      var u = (t - 35) / 5;
      var bob = 0.5 - 0.5 * Math.cos(u * Math.PI * 2);
      pos.copy(A);
      pos.y += bob * 0.03;
      pos.z += bob * 0.02;
      dir.copy(outCurve.getTangentAt(0.0));
    }
    return { pos: pos, dir: dir, orbiting: orbiting };
  }

  var lastPos = null;
  var thruster = null;

  function placeCraft(p, speed) {
    craft.position.copy(p.pos);
    var look = p.pos.clone().add(p.dir);
    craft.lookAt(look);
    craft.rotateZ(0.35);
    if (!thruster) {
      craft.traverse(function (o) {
        if (o.isSprite && o.position.z < -0.2) thruster = o;
      });
    }
    if (thruster) {
      var glow = Math.min(0.6, 0.16 + speed * 0.35);
      thruster.material.opacity = glow;
      thruster.scale.set(0.12 + speed * 0.18, 0.12 + speed * 0.18, 1);
    }
  }

  function resize() {
    try {
      var w = hero.clientWidth;
      var h = hero.clientHeight;
      if (w === 0 || h === 0) return;
      var pr = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(pr);
      renderer.setSize(w, h, false);
      var aspect = w / h;
      var targetH = 4.2;
      if (aspect >= 1.2) {
        camera.fov = 2 * Math.atan(targetH / 9) * 180 / Math.PI;
      } else if (aspect >= 0.5) {
        camera.fov = 2 * Math.atan((targetH * 1.5 / aspect) / 9) * 180 / Math.PI;
      } else {
        camera.fov = 2 * Math.atan((targetH * 2 / aspect) / 9) * 180 / Math.PI;
      }
      camera.updateProjectionMatrix();
    } catch (e) {
      console.warn('Resize error in space animation:', e);
    }
  }
  
  try {
    window.addEventListener('resize', resize);
    resize();
  } catch (e) {
    console.warn('Space animation resize initialization error:', e);
  }

  var mouseX = 0, mouseY = 0;
  try {
    window.addEventListener('mousemove', function (e) {
      try {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
      } catch (err) {
        console.warn('Mouse move handler error:', err);
      }
    }, { passive: true });
  } catch (e) {
    console.warn('Mouse move listener error:', e);
  }

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function tick() {
    try {
      requestAnimationFrame(tick);
      var dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt;

      var p = pose(elapsed);
      var sp = lastPos ? p.pos.distanceTo(lastPos) / dt : 0;
      lastPos = p.pos.clone();
      placeCraft(p, sp);
      updateTrail(p.pos);

      stars.material.uniforms.uTime.value = elapsed;
      stars.rotation.y += dt * 0.004;
      earth.rotation.y += dt * 0.006;
      clouds.rotation.y += dt * 0.012;
      planet.rotation.y += dt * 0.02;
      sunMesh.rotation.y += dt * 0.01;
      rocky.rotation.y += dt * 0.015;
      pale.rotation.y += dt * 0.012;
      dwarf.rotation.y += dt * 0.02;
      var pulse = Math.sin(elapsed * 0.8);
      sunGlow.material.opacity = 0.52 + pulse * 0.08;
      sunGlow.scale.set(13.5 + pulse * 0.9, 13.5 + pulse * 0.9, 1);

      var drift = Math.sin(elapsed * 0.05) * 0.12;
      camera.position.x += ((mouseX * 0.6 + drift) - camera.position.x) * 0.03;
      camera.position.y += ((mouseY * 0.35 + 0.7) - camera.position.y) * 0.03;
      camera.lookAt(0, 0.5, 0);

      renderer.render(scene, camera);
    } catch (e) {
      console.warn('Animation frame error:', e);
    }
  }

  var clock = new THREE.Clock();
  var elapsed = 0;

  try {
    if (reduced) {
      var p0 = pose(0);
      placeCraft(p0, 0);
      renderer.render(scene, camera);
      return;
    }

    tick();
  } catch (e) {
    console.warn('Space animation initialization error:', e);
  }
    } catch (e) {
      console.error('Critical space animation error:', e);
    }
  }

  // Safe initialization
  try {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      startSpaceAnimation();
    } else {
      window.addEventListener('load', startSpaceAnimation, { once: true });
    }
  } catch (e) {
    console.warn('Space animation load listener error:', e);
  }

  // Global error handler to prevent animation errors from breaking the page
  window.addEventListener('error', function(event) {
    if (event.filename && event.filename.includes('space-animation')) {
      console.warn('Space animation error caught:', event.message);
      event.preventDefault();
    }
  });

})();

