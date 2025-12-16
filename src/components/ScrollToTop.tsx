<<<<<<< HEAD
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
=======
// ScrollToTop.tsx - ページ遷移時にスクロール位置を先頭に戻す
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
>>>>>>> 4ed9a16 (fix(calendar): iOS実機対策とモバイルUX改善)
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
