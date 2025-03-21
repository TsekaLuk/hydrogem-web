import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import '@/styles/optimized-image.css';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  lazyLoad?: boolean;
  placeholderSrc?: string;
  blurhash?: string;
  aspectRatio?: number; // 宽高比
  className?: string;
  objectFit?: React.CSSProperties['objectFit'];
  priority?: boolean; // 高优先级，不使用懒加载
}

/**
 * 优化的图像组件，支持懒加载、模糊哈希占位符和渐入效果
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  lazyLoad = true,
  placeholderSrc,
  blurhash,
  aspectRatio,
  className,
  objectFit = 'cover',
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(priority ? src : (placeholderSrc || ''));
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 计算样式类
  const containerClasses = cn(
    "optimized-image-container", 
    className
  );
  
  const imageClasses = cn(
    "optimized-image",
    isLoaded ? "loaded" : "loading",
    `object-${objectFit}` // 使用工具类处理objectFit
  );

  // 使用useEffect更新CSS变量来处理动态样式
  useEffect(() => {
    if (!containerRef.current) return;
    
    // 设置宽度和高度
    if (width) containerRef.current.style.setProperty('--image-width', `${width}px`);
    if (height) containerRef.current.style.setProperty('--image-height', `${height}px`);
    
    // 根据宽高比计算
    if (aspectRatio) {
      containerRef.current.style.setProperty('--aspect-ratio', aspectRatio.toString());
      
      if (!height && width) {
        containerRef.current.style.setProperty('--calculated-height', `${width / aspectRatio}px`);
      } else if (!width && height) {
        containerRef.current.style.setProperty('--calculated-width', `${height * aspectRatio}px`);
      } else if (!width && !height) {
        containerRef.current.classList.add('use-aspect-ratio');
      }
    }
  }, [width, height, aspectRatio]);

  // 处理懒加载逻辑
  useEffect(() => {
    // 如果priority为true或lazyLoad为false，直接加载图片
    if (priority || !lazyLoad) {
      setImgSrc(src);
      return;
    }

    // 使用IntersectionObserver实现懒加载
    if ('IntersectionObserver' in window && imgRef.current && !observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImgSrc(src);
            observerRef.current?.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '200px', // 提前200px开始加载
        threshold: 0
      });

      observerRef.current.observe(imgRef.current);
    } else {
      // 如果不支持IntersectionObserver，直接加载图片
      setImgSrc(src);
    }

    return () => {
      if (observerRef.current && imgRef.current) {
        observerRef.current.unobserve(imgRef.current);
        observerRef.current = null;
      }
    };
  }, [src, lazyLoad, priority]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    // 如果加载失败且有占位图，显示占位图
    if (imgSrc !== placeholderSrc && placeholderSrc) {
      setImgSrc(placeholderSrc);
    }
    setIsLoaded(true); // 即使错误也设置为已加载，以显示错误状态
  };

  return (
    <div ref={containerRef} className={containerClasses} data-has-blurhash={!!blurhash}>
      {/* 如果有blurhash，可以放置blurhash背景 */}
      {blurhash && !isLoaded && (
        <div 
          className="blurhash-placeholder"
          data-blurhash={blurhash}
        />
      )}
      
      <img
        ref={imgRef}
        src={imgSrc}
        alt={alt}
        className={imageClasses}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={!priority && lazyLoad ? 'lazy' : undefined}
        {...props}
      />
    </div>
  );
}

export default OptimizedImage;
