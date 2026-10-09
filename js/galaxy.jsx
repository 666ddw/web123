/* Galaxy 组件（JavaScript + CSS 变体，依赖 ogl） */
(function () {
  const { useRef, useEffect } = React;
  const { Renderer, Program, Mesh, Triangle } = OGL;
  const { VERT, FRAG } = window.GalaxyShaders;

  function Galaxy({
    focal = [0.5, 0.5],
    rotation = [1.0, 0.0],
    starSpeed = 0.5,
    density = 1,
    hueShift = 140,
    disableAnimation = false,
    speed = 1.0,
    mouseInteraction = true,
    glowIntensity = 0.3,
    saturation = 0.0,
    mouseRepulsion = true,
    repulsionStrength = 2,
    twinkleIntensity = 0.3,
    rotationSpeed = 0.1,
    autoCenterRepulsion = 0,
    transparent = true,
  }) {
    const containerRef = useRef(null);
    const optsRef = useRef({});

    optsRef.current = {
      focal, rotation, starSpeed, density, hueShift, disableAnimation, speed,
      mouseInteraction, glowIntensity, saturation, mouseRepulsion,
      repulsionStrength, twinkleIntensity, rotationSpeed,
      autoCenterRepulsion, transparent,
    };

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let renderer;
      try {
        renderer = new Renderer({
          alpha: true,
          premultipliedAlpha: false,
          antialias: false,
          dpr: Math.min(window.devicePixelRatio || 1, 2),
        });
      } catch (err) {
        console.warn('[Galaxy] WebGL 初始化失败：', err);
        return;
      }

      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);

      const canvas = gl.canvas;
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      container.appendChild(canvas);

      const geometry = new Triangle(gl);

      const uniforms = {
        uTime:               { value: 0 },
        uResolution:         { value: [1, 1] },
        uFocal:              { value: [0.5, 0.5] },
        uStarSpeed:          { value: 0.5 },
        uDensity:            { value: 1 },
        uHueShift:           { value: 140 },
        uSpeed:              { value: 1 },
        uMouse:              { value: [0.5, 0.5] },
        uGlowIntensity:      { value: 0.3 },
        uSaturation:         { value: 0 },
        uMouseRepulsion:     { value: 1 },
        uTwinkleIntensity:   { value: 0.3 },
        uRepulsionStrength:  { value: 2 },
        uMouseActive:        { value: 0 },
        uAutoCenterRepulsion:{ value: 0 },
        uTransparent:        { value: 1 },
        uRotationAngle:      { value: 0 },
      };

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms,
      });

      const mesh = new Mesh(gl, { geometry, program });

      const resize = () => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        renderer.setSize(w, h);
        uniforms.uResolution.value[0] = gl.drawingBufferWidth;
        uniforms.uResolution.value[1] = gl.drawingBufferHeight;
      };
      resize();

      let ro;
      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(resize);
        ro.observe(container);
      } else {
        window.addEventListener('resize', resize);
      }

      const mouse = {
        x: 0.5, y: 0.5,
        tx: 0.5, ty: 0.5,
        active: 0, targetActive: 0,
      };

      const onPointerMove = (e) => {
        mouse.tx = e.clientX / window.innerWidth;
        mouse.ty = 1.0 - e.clientY / window.innerHeight;
        mouse.targetActive = 1;
      };
      const onPointerOut = () => { mouse.targetActive = 0; };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerleave', onPointerOut);
      window.addEventListener('blur', onPointerOut);

      let raf = 0;
      let last = performance.now();
      let elapsed = 0;
      let angle = 0;

      const loop = (now) => {
        raf = requestAnimationFrame(loop);
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;

        const o = optsRef.current;

        if (!o.disableAnimation) {
          elapsed += dt;
          angle += dt * o.rotationSpeed * 0.32;
        }

        const k = Math.min(1, dt * 6.5);
        mouse.x += (mouse.tx - mouse.x) * k;
        mouse.y += (mouse.ty - mouse.y) * k;
        mouse.active += ((o.mouseInteraction ? mouse.targetActive : 0) - mouse.active) * Math.min(1, dt * 4);

        uniforms.uTime.value = elapsed;
        uniforms.uRotationAngle.value = angle;

        const f = uniforms.uFocal.value;
        f[0] = o.focal[0];
        f[1] = o.focal[1];

        uniforms.uStarSpeed.value = o.starSpeed;
        uniforms.uDensity.value = o.density;
        uniforms.uHueShift.value = o.hueShift;
        uniforms.uSpeed.value = o.speed;
        uniforms.uGlowIntensity.value = o.glowIntensity;
        uniforms.uSaturation.value = o.saturation;
        uniforms.uMouseRepulsion.value = o.mouseRepulsion ? 1 : 0;
        uniforms.uTwinkleIntensity.value = o.twinkleIntensity;
        uniforms.uRepulsionStrength.value = o.repulsionStrength;
        uniforms.uMouseActive.value = mouse.active;
        uniforms.uAutoCenterRepulsion.value = o.autoCenterRepulsion;
        uniforms.uTransparent.value = o.transparent ? 1 : 0;

        const m = uniforms.uMouse.value;
        m[0] = mouse.x;
        m[1] = mouse.y;

        renderer.render({ scene: mesh });
      };
      raf = requestAnimationFrame(loop);

      return () => {
        cancelAnimationFrame(raf);
        if (ro) ro.disconnect();
        else window.removeEventListener('resize', resize);

        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerleave', onPointerOut);
        window.removeEventListener('blur', onPointerOut);

        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);

        const lose = gl.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();
      };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
  }

  window.Galaxy = Galaxy;
})();