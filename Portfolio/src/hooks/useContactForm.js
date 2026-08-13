import { useCallback, useRef, useState } from 'react';

// Formspree endpoint — submissions post here instead of falling through to
// the mailto: link.
const ENDPOINT = 'https://formspree.io/f/mljrbprr';

export default function useContactForm(toEmail) {
  const TO = toEmail || 'farhannadim2023@gmail.com';
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [invalid, setInvalid] = useState({});
  const [note, setNote] = useState({ text: '', kind: '' });
  const [sending, setSending] = useState(false);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  const fieldRefs = { name: nameRef, email: emailRef, message: messageRef };

  const onChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setInvalid((inv) => (inv[name] ? { ...inv, [name]: false } : inv));
  }, []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const name = values.name.trim();
      const email = values.email.trim();
      const subject = values.subject.trim();
      const message = values.message.trim();

      const bad = {};
      if (!name) bad.name = true;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) bad.email = true;
      if (!message) bad.message = true;

      setInvalid(bad);
      if (Object.keys(bad).length) {
        const firstBadField = ['name', 'email', 'message'].find((k) => bad[k]);
        fieldRefs[firstBadField]?.current?.focus();
        setNote({ text: 'Fill in your name, a valid email and a message.', kind: 'err' });
        return;
      }

      if (ENDPOINT) {
        setSending(true);
        setNote({ text: 'Sending…', kind: '' });
        const fd = new FormData();
        fd.append('name', name);
        fd.append('email', email);
        fd.append('subject', subject);
        fd.append('message', message);
        fetch(ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: fd })
          .then((res) => {
            if (!res.ok) throw new Error('bad status');
            setValues({ name: '', email: '', subject: '', message: '' });
            setNote({ text: 'Thanks — your message is on its way.', kind: 'ok' });
          })
          .catch(() => {
            setNote({ text: 'That did not send. Email ' + TO + ' directly.', kind: 'err' });
          })
          .then(() => setSending(false));
        return;
      }

      const subj = subject || `Message from ${name}`;
      const body = `${message}\n\n— ${name} (${email})`;
      window.location.href = `mailto:${TO}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
      setNote({ text: 'Opening your mail app with the message ready to send.', kind: 'ok' });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values, TO]
  );

  return { values, invalid, note, sending, onChange, onSubmit, nameRef, emailRef, messageRef };
}
