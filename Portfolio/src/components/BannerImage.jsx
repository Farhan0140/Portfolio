import { useState } from 'react';

/**
 * Ports the "Project screenshots" IIFE: the banner only gets `.has-shot`
 * once its image genuinely decodes; a missing/broken file is dropped
 * silently and the emoji/grid placeholder underneath stays visible.
 */
export default function BannerImage({ src, alt, width, height, onHasShot }) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      className="banner-shot"
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      width={width}
      height={height}
      onLoad={() => onHasShot(true)}
      onError={() => setFailed(true)}
    />
  );
}
