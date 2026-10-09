/* Counter / CursorGlow / TiltCard */
(function () {
  const { useState, useEffect, useRef } = React;

  /* ---------- 数字滚动 ---------- */
  function Counter({ to, suffix = '', decimals = 0, duration = 1600 }) {
    const [val, setVal] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
      const el = ref.current;
      if (!el || !('IntersectionObserver' in window)) {
        setVal(to);
        return;
      }
      let raf = 0;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(to * eased);
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        },
        { threshold: 0.4 }
      );
      io.observe(el);
      return () => {
        io.disconnect();
        cancelAnimationFrame(raf);
      };
    }, [to, duration]);

    return (
      <span ref={ref}>
        {val.toFixed(decimals)}
        {suffix}
      </span>
    );
  }

  /* ---------- 鼠标光晕 ---------- */
  function CursorGlow() {
    const ref = useRef(null);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;
      let cx = x, cy = y;
      let raf = 0;

      const onMove = (e) => { x = e.clientX; y = e.clientY; };
      const loop = () => {
        raf = requestAnimationFrame(loop);
        cx += (x - cx) * 0.09;
        cy += (y - cy) * 0.09;
        el.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      raf = requestAnimationFrame(loop);

      return () => {
        window.removeEventListener('pointermove', onMove);
        cancelAnimationFrame(raf);
      };
    }, []);

    return <div className="cursor-glow" ref={ref} />;
  }

  /* ---------- 3D 倾斜卡片 ---------- */
  function TiltCard({ children }) {
    const ref = useRef(null);

    const onMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const dx = px - 0.5;
      const dy = py - 0.5;
      el.style.transform = `perspective(900px) rotateX(${-dy * 9}deg) rotateY(${dx * 12}deg) translateY(-6px)`;
      el.style.setProperty('--mx', `${px * 100}%`);
      el.style.setProperty('--my', `${py * 100}%`);
    };

    const onLeave = () => {
      const el = ref.current;
      if (!el) return;
      el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
    };

    return (
      <div className="card" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
        {children}
      </div>
    );
  }

  window.Counter = Counter;
  window.CursorGlow = CursorGlow;
  window.TiltCard = TiltCard;
})();