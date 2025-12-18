// ScrollToTop.tsx - ページ遷移時にスクロール位置を先頭に戻す（hash対応）
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // hashがある場合は、DOMが描画されるまで待ってからスクロール
      const scrollToHash = () => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      // requestAnimationFrameを2回呼んでDOMの描画を待つ
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToHash);
      });
    } else {
      // hashがない場合は従来通りトップへ
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
