import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  storageKey: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  subtitle,
  storageKey,
  defaultOpen = true,
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    // localStorage から状態を復元
    if (typeof window === 'undefined') return defaultOpen;
    
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        return saved === 'true';
      }
    } catch (e) {
      console.error('Failed to load collapsible state:', e);
    }
    
    return defaultOpen;
  });

  // 状態が変わったら localStorage に保存
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(isOpen));
    } catch (e) {
      console.error('Failed to save collapsible state:', e);
    }
  }, [isOpen, storageKey]);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-white p-4 sm:p-6 shadow-sm border border-slate-100">
      {/* ヘッダー部分 */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-xs sm:text-sm text-slate-600">{subtitle}</p>
          )}
        </div>

        {/* トグルボタン */}
        <button
          type="button"
          onClick={toggleOpen}
          className="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <>
              <ChevronUp className="h-3 w-3" />
              <span className="hidden sm:inline">閉じる</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              <span className="hidden sm:inline">詳しく見る</span>
            </>
          )}
        </button>
      </div>

      {/* コンテンツ部分 */}
      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </section>
  );
};

export default CollapsibleSection;
