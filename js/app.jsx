/* 主应用 + 挂载 */
(function () {
  const { useState, useEffect } = React;
  const {
    Galaxy, useReveal,
    Counter, CursorGlow, TiltCard,
    FEATURES, STATS,
  } = window;

  function App() {
    useReveal();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > 24);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const titleLines = [
      { text: 'EXPLORE', accent: false },
      { text: 'THE UNKNOWN', accent: true },
    ];
    let charIndex = 0;

    return (
      <React.Fragment>
        {/* ---------- 背景 ---------- */}
        <div className="bg-layer">
          <Galaxy
            starSpeed={0.6}
            density={1.3}
            hueShift={205}
            glowIntensity={0.5}
            saturation={0.62}
            mouseRepulsion={true}
            mouseInteraction={true}
            repulsionStrength={2.6}
            twinkleIntensity={0.55}
            rotationSpeed={0.07}
            speed={0.9}
            transparent={true}
          />
        </div>
        <div className="bg-grid" />
        <div className="bg-vignette" />
        <div className="bg-scan" />
        <CursorGlow />

        <div className="shell">
          {/* ---------- 导航 ---------- */}
          <header className={`nav${scrolled ? ' scrolled' : ''}`}>
            <div className="wrap nav-inner">
              <a href="#top" className="logo">
                <span className="logo-mark" />
                NOVA
              </a>
              <nav className="nav-links">
                <a href="#features">特性</a>
                <a href="#metrics">数据</a>
                <a href="#start">开始</a>
              </nav>
              <a href="#start" className="btn btn-primary">
                立即启程
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </header>

          <main id="top">
            {/* ---------- Hero ---------- */}
            <section className="hero wrap">
              <div className="tag">
                <span className="dot" />
                WebGL · 实时星海引擎 v2.4
              </div>

              <h1 className="hero-title">
                {titleLines.map((line, li) => (
                  <span className="line" key={li}>
                    {line.text.split('').map((ch, i) => {
                      const delay = 0.06 * charIndex++;
                      return (
                        <span
                          key={i}
                          className={`char${line.accent ? ' accent' : ''}`}
                          style={{ animationDelay: `${delay}s` }}
                        >
                          {ch === ' ' ? '\u00A0' : ch}
                        </span>
                      );
                    })}
                  </span>
                ))}
              </h1>

              <p className="hero-sub">
                用 <strong>GPU 实时光线</strong> 点亮四千颗恒星，
                鼠标划过即成引力场。<br />
                这不只是一张背景图 —— 这是一个会呼吸的宇宙。
              </p>

              <div className="hero-actions">
                <a href="#start" className="btn btn-primary">
                  免费开始探索
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
                <a href="#features" className="btn btn-ghost">查看技术细节</a>
              </div>

              <dl className="hero-meta">
                <div>
                  <dt>渲染方式</dt>
                  <dd>Fragment Shader</dd>
                </div>
                <div>
                  <dt>依赖库</dt>
                  <dd>ogl · 12 KB</dd>
                </div>
                <div>
                  <dt>交互</dt>
                  <dd>鼠标斥力 + 视差</dd>
                </div>
              </dl>

              <div className="scroll-hint">
                <span>SCROLL</span>
                <span className="bar" />
              </div>
            </section>

            {/* ---------- 数据条 ---------- */}
            <section className="block wrap" id="metrics" style={{ paddingTop: 0 }}>
              <div className="stats" data-reveal>
                {STATS.map((s, i) => (
                  <div className="stat" key={i}>
                    <span className="num">
                      <Counter to={s.num} suffix={s.suffix} decimals={s.decimals || 0} />
                    </span>
                    <span className="lbl">{s.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ---------- 特性 ---------- */}
            <section className="block wrap" id="features">
              <div className="eyebrow" data-reveal>核心技术</div>
              <h2 data-reveal data-delay="1">
                让星空 <em>真正活起来</em>
              </h2>
              <p className="lede" data-reveal data-delay="2">
                每一帧都在 GPU 上从零生成。没有贴图，没有视频，没有妥协 ——
                只有纯粹的数学与光。
              </p>

              <div className="grid">
                {FEATURES.map((f, i) => (
                  <div data-reveal data-delay={String((i % 3) + 1)} key={i}>
                    <TiltCard>
                      <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                      <div className="card-ico">{f.ico}</div>
                      <h3>{f.title}</h3>
                      <p>{f.desc}</p>
                    </TiltCard>
                  </div>
                ))}
              </div>
            </section>

            {/* ---------- CTA ---------- */}
            <section className="block wrap" id="start">
              <div className="cta" data-reveal>
                <div className="eyebrow" style={{ justifyContent: 'center' }}>准备就绪</div>
                <h2>
                  你的宇宙，<em>现在启程</em>
                </h2>
                <p className="lede">
                  复制组件、安装 ogl、写上三行代码。
                  剩下的，交给星空。
                </p>
                <div className="row">
                  <a href="#top" className="btn btn-primary">
                    回到顶部再看一次
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19V5M6 11l6-6 6 6" />
                    </svg>
                  </a>
                  <a href="#features" className="btn btn-ghost">浏览特性</a>
                </div>
              </div>
            </section>
          </main>

          {/* ---------- 页脚 ---------- */}
          <footer className="wrap">
            <span>© 2025 NOVA · 用 WebGL 点亮每一个像素</span>
            <div className="fl">
              <a href="#features">特性</a>
              <a href="#metrics">数据</a>
              <a href="#start">开始</a>
            </div>
          </footer>
        </div>
      </React.Fragment>
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();