import { useRef, useState } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import useContactForm from '../hooks/useContactForm';
import useCopyToClipboard from '../hooks/useCopyToClipboard';

function EmailSocialPill({ email }) {
  const [label, setLabel] = useState('Email');
  const timerRef = useRef(null);

  return (
    <a
      href={`mailto:${email}?subject=Hello%20Farhan`}
      className="social-pill"
      data-copy={email}
      title="Click to email · right-click to copy the address"
      onContextMenu={(e) => {
        if (!navigator.clipboard) return;
        e.preventDefault();
        navigator.clipboard
          .writeText(email)
          .then(() => {
            setLabel('Copied');
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setLabel('Email'), 1600);
          })
          .catch(() => {});
      }}
    >
      <svg className="ic" aria-hidden="true">
        <use href="#i-mail" />
      </svg>{' '}
      <span>{label}</span>
    </a>
  );
}

function ContactCard({ icon, label, value, href, copyValue }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="contact-card reveal">
      <span className="contact-ico">
        <svg className="ic" aria-hidden="true">
          <use href={`#${icon}`} />
        </svg>
      </span>
      <span className="contact-meta">
        <span className="contact-label">{label}</span>
        {href ? (
          <a className="contact-value" href={href}>{value}</a>
        ) : (
          <span className="contact-value">{value}</span>
        )}
      </span>
      <button
        type="button"
        className={'copy-btn' + (copied ? ' copied' : '')}
        aria-label={`Copy ${label.toLowerCase()}`}
        title={`Copy ${label.toLowerCase()}`}
        onClick={() => copy(copyValue)}
      >
        <svg className="ic ic-copy" aria-hidden="true">
          <use href="#i-copy" />
        </svg>
        <svg className="ic ic-done" aria-hidden="true">
          <use href="#i-check" />
        </svg>
      </button>
    </div>
  );
}

export default function Contact() {
  const { profile, socialLinks } = usePortfolioData();
  const { values, invalid, note, sending, onChange, onSubmit, nameRef, emailRef, messageRef } = useContactForm(profile.email);
  const footerLinks = socialLinks.filter((l) => l.showInFooter);
  const telHref = profile.phone ? `tel:${profile.phone.replace(/[^\d+]/g, '')}` : undefined;

  return (
    <footer id="contact" data-label="Contact">
      <div className="footer-title reveal">Let&apos;s build something 🌱</div>
      <p className="footer-sub reveal">Always open to connecting, collaborating, or talking about IoT.</p>
      <div className="social-row reveal">
        {profile.email && <EmailSocialPill email={profile.email} />}
        {footerLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target={link.url?.startsWith('/') ? undefined : '_blank'}
            rel="noopener"
            className="social-pill"
            download={link.platform === 'cv' || undefined}
          >
            <svg className="ic" aria-hidden="true">
              <use href={`#${link.icon}`} />
            </svg>{' '}
            <span>{link.label}</span>
          </a>
        ))}
      </div>
      <div className="contact-grid">
        <div className="contact-cards">
          {profile.email && (
            <ContactCard icon="i-mail" label="Email address" value={profile.email} href={`mailto:${profile.email}`} copyValue={profile.email} />
          )}
          {profile.phone && (
            <ContactCard icon="i-phone" label="Phone number" value={profile.phone} href={telHref} copyValue={profile.phone} />
          )}
          {profile.contactLocation && (
            <ContactCard icon="i-pin" label="Location" value={profile.contactLocation} copyValue={profile.contactLocation} />
          )}
        </div>

        <form className="contact-form reveal" id="contactForm" noValidate onSubmit={onSubmit}>
          <h3>Send a message</h3>
          <div className={'field' + (invalid.name ? ' invalid' : '')}>
            <input
              id="cfName"
              name="name"
              type="text"
              placeholder=" "
              autoComplete="name"
              required
              value={values.name}
              onChange={onChange}
              ref={nameRef}
            />
            <label htmlFor="cfName">Your name</label>
          </div>
          <div className={'field' + (invalid.email ? ' invalid' : '')}>
            <input
              id="cfEmail"
              name="email"
              type="email"
              placeholder=" "
              autoComplete="email"
              required
              value={values.email}
              onChange={onChange}
              ref={emailRef}
            />
            <label htmlFor="cfEmail">Email address</label>
          </div>
          <div className="field">
            <input id="cfSubject" name="subject" type="text" placeholder=" " value={values.subject} onChange={onChange} />
            <label htmlFor="cfSubject">Subject</label>
          </div>
          <div className={'field' + (invalid.message ? ' invalid' : '')}>
            <textarea
              id="cfMessage"
              name="message"
              rows="3"
              placeholder=" "
              required
              value={values.message}
              onChange={onChange}
              ref={messageRef}
            />
            <label htmlFor="cfMessage">Your message</label>
          </div>
          <button type="submit" className="send-btn" disabled={sending}>
            Send message{' '}
            <svg className="ic" aria-hidden="true">
              <use href="#i-arrow-right" />
            </svg>
          </button>
          <p className={'form-note' + (note.kind ? ` ${note.kind}` : '')} id="formNote" role="status" aria-live="polite">
            {note.text}
          </p>
        </form>
      </div>

      <div className="footer-bottom reveal">
        <div className="brand-mark">
          {profile.firstName || 'Farhan'}<span className="dot">.</span>
        </div>
        <p className="rights">
          &copy; <span id="year">{new Date().getFullYear()}</span> &middot; All rights reserved.
        </p>
      </div>
    </footer>
  );
}
