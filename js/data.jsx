/* 页面数据 */
(function () {
  window.FEATURES = [
    { ico: '◈', title: '实时着色器渲染', desc: '基于 WebGL 的片元着色器管线，每一颗星都由 GPU 实时计算，无需任何贴图资源。' },
    { ico: '⌁', title: '鼠标引力场', desc: '指针划过时产生真实的斥力扰动，星海会顺着你的轨迹让开一条通道。' },
    { ico: '◐', title: '多层视差深度', desc: '五层独立星层以不同速度旋转缩放，构建出真实的纵深感与沉浸体验。' },
    { ico: '✦', title: '辉光与闪烁', desc: '每颗星拥有独立的半径、亮度与呼吸频率，十字光芒让亮星自然脱颖而出。' },
    { ico: '◔', title: '色相实时调校', desc: '一条 hueShift 参数即可从幽蓝星海切换到炽紫星云，配出属于你的宇宙。' },
    { ico: '⚡', title: '极致轻量', desc: '核心依赖仅 ogl 一个包，打包体积以 KB 计，性能开销几乎可以忽略。' },
  ];

  window.STATS = [
    { num: 120, suffix: '+', label: 'FPS 稳定帧率' },
    { num: 4000, suffix: '', label: '实时渲染星体' },
    { num: 5, suffix: ' 层', label: '视差星层' },
    { num: 12.8, suffix: ' KB', decimals: 1, label: '核心体积' },
  ];
})();