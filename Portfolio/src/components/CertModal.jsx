import { useEffect, useRef, useState } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';

/** Certificate modal — shows the certificate image whole, never cropped. */
export default function CertModal({ openId, onClose }) {
  const { certModalData } = usePortfolioData();
  const closeBtnRef = useRef(null);
  const lastFocused = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const data = openId ? certModalData[openId] : null;
  const open = Boolean(data);

  const [probedFor, setProbedFor] = useState(openId);
  if (probedFor !== openId) {
    setProbedFor(openId);
    setImgSrc(null);
  }

  useEffect(() => {
    if (!data || !data.image) return undefined;
    let cancelled = false;
    const probe = new Image();
    probe.onload = () => {
      if (!cancelled) setImgSrc(data.image);
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
      className={'modal-overlay cert-modal' + (open ? ' open' : '')}
      role="dialog"
      aria-modal="true"
      aria-labelledby="certModalTitle"
      aria-hidden={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="modal-box">
        {imgSrc && (
          <img className="cert-shot" id="certModalImg" src={imgSrc} alt={data ? `${data.title} certificate` : ''} decoding="async" />
        )}
        <button className="modal-close" id="certModalClose" aria-label="Close" ref={closeBtnRef} onClick={handleClose}>
          &times;
        </button>
        <div className="modal-content">
          <h3 id="certModalTitle">{data?.title}</h3>
          <p className="modal-desc" id="certModalDesc">
            {data ? [data.issuer, data.desc].filter(Boolean).join(' — ') : ''}
          </p>
          <div className="modal-links" id="certModalLinks">
            {data?.image && (
              <a className="live-link" href={data.image} target="_blank" rel="noopener noreferrer">
                <svg className="ic" aria-hidden="true">
                  <use href="#i-eye" />
                </svg>{' '}
                Open full size
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
