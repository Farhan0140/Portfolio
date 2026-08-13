import { useEffect, useRef, useState } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';

/**
 * Full-detail modal shared by both the regular project cards and the IoT
 * project cards (both use `data-project` + this same `projectModalData`
 * object, exactly like the source's single #projectModal).
 */
export default function ProjectModal({ openId, onClose }) {
  const { projectModalData } = usePortfolioData();
  const closeBtnRef = useRef(null);
  const lastFocused = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [hasShot, setHasShot] = useState(false);

  const data = openId ? projectModalData[openId] : null;
  const open = Boolean(data);

  // Reset the probed image as soon as the modal target changes (adjusting
  // state during render, not in an effect, so there is no extra frame with
  // the previous project's banner still showing).
  const [probedFor, setProbedFor] = useState(openId);
  if (probedFor !== openId) {
    setProbedFor(openId);
    setImgSrc(null);
    setHasShot(false);
  }

  // Probe the image before swapping it in, same as the source — a missing
  // file never shows a broken frame.
  useEffect(() => {
    if (!data || !data.image) return undefined;
    let cancelled = false;
    const probe = new Image();
    probe.onload = () => {
      if (cancelled) return;
      setImgSrc(data.image);
      setHasShot(true);
    };
    probe.onerror = () => {
      if (cancelled) return;
      setImgSrc(null);
      setHasShot(false);
    };
    probe.src = data.image;
    return () => {
      cancelled = true;
    };
  }, [data]);

  useEffect(() => {
    if (open) {
      lastFocused.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  function handleClose() {
    onClose();
    if (lastFocused.current && lastFocused.current.focus) lastFocused.current.focus();
  }

  return (
    <div
      className={'modal-overlay' + (open ? ' open' : '')}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      aria-hidden={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="modal-box">
        <div className={'modal-banner' + (hasShot ? ' has-shot' : '')} id="modalBanner">
          <span className="banner-grid" />
          {imgSrc && <img className="banner-shot" id="modalImg" src={imgSrc} alt={data ? data.title : ''} loading="lazy" decoding="async" />}
          <span className="banner-emoji" id="modalEmoji">{data?.emoji || ''}</span>
          <button className="modal-close" id="modalClose" aria-label="Close" ref={closeBtnRef} onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="modal-content">
          <span className="modal-status" id="modalStatus">
            {data?.status === 'live' && (
              <span className="status-flag live">
                <span className="blip" />
                Live
              </span>
            )}
            {data?.status === 'progress' && (
              <span className="status-flag progress">
                <span className="blip" />
                In Progress
              </span>
            )}
          </span>
          <h3 id="modalTitle">{data?.title}</h3>
          <p className="modal-desc" id="modalDesc">{data?.desc}</p>
          <div>
            <div className="modal-section-label" id="modalTagsLabel">{data?.tagsLabel}</div>
            <div className="component-tags" id="modalTags" style={{ marginTop: 8 }}>
              {(data?.tags || []).map((t) => (
                <span className="component-tag" key={t}>{t}</span>
              ))}
            </div>
          </div>
          <div className="modal-links" id="modalLinks">
            {data?.links?.code && (
              <a className="code-link" href={data.links.code} target="_blank" rel="noopener">
                <svg className="ic" aria-hidden="true">
                  <use href="#i-branch" />
                </svg>{' '}
                Code
              </a>
            )}
            {data?.links?.live && (
              <a className="live-link" href={data.links.live} target="_blank" rel="noopener">
                <svg className="ic" aria-hidden="true">
                  <use href="#i-link" />
                </svg>{' '}
                Live
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
