/* 滚动进场钩子 */
(function () {
  const { useEffect } = React;

  function useReveal() {
    useEffect(() => {
      const els = document.querySelectorAll('[data-reveal]');
      if (!('IntersectionObserver' in window)) {
        els.forEach((el) => el.classList.add('is-visible'));
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
      );
      els.forEach((el) => io.observe(el));
      return () => io.disconnect();
    }, []);
  }

  window.useReveal = useReveal;
})();