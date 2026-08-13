// Inline icon sprite — one <symbol> per icon used across the app, referenced
// elsewhere via <svg class="ic"><use href="#i-xxx"/></svg>. Mounted once near
// the root so every <use> in the tree can resolve it.
export default function IconSprite() {
  return (
    <svg className="sprite" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <symbol id="i-cap" viewBox="0 0 24 24"><path d="M12 4 22 9l-10 5L2 9z" /><path d="M6 11v4.6c0 1.7 2.7 3 6 3s6-1.3 6-3V11" /><path d="M22 9v5.5" /></symbol>
        <symbol id="i-monitor" viewBox="0 0 24 24"><rect x="2.5" y="4" width="19" height="13" rx="2" /><path d="M8.5 21h7M12 17v4" /></symbol>
        <symbol id="i-plug" viewBox="0 0 24 24"><path d="M9 2.5v5.5M15 2.5v5.5" /><path d="M6.5 8h11v3a5.5 5.5 0 0 1-11 0z" /><path d="M12 16.5V21.5" /></symbol>
        <symbol id="i-signal" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.6" /><path d="M8.6 15.4a4.8 4.8 0 0 1 0-6.8M15.4 8.6a4.8 4.8 0 0 1 0 6.8" /><path d="M5.7 18.3a9 9 0 0 1 0-12.6M18.3 5.7a9 9 0 0 1 0 12.6" /></symbol>
        <symbol id="i-battery" viewBox="0 0 24 24"><rect x="2.5" y="7.5" width="16" height="9" rx="2.5" /><path d="M21.5 11v2" /><path d="M6.5 10.5v3M10 10.5v3M13.5 10.5v3" /></symbol>
        <symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></symbol>
        <symbol id="i-cpu" viewBox="0 0 24 24"><rect x="6.5" y="6.5" width="11" height="11" rx="2" /><rect x="10" y="10" width="4" height="4" rx="1" /><path d="M9.5 2.6v3.9M14.5 2.6v3.9M9.5 17.5v3.9M14.5 17.5v3.9M2.6 9.5h3.9M2.6 14.5h3.9M17.5 9.5h3.9M17.5 14.5h3.9" /></symbol>
        <symbol id="i-bulb" viewBox="0 0 24 24"><path d="M9.5 18.2h5M10.6 21h2.8" /><path d="M12 2.6a6.5 6.5 0 0 0-4.2 11.5c.8.7 1.2 1.5 1.2 2.4h6c0-.9.4-1.7 1.2-2.4A6.5 6.5 0 0 0 12 2.6z" /></symbol>
        <symbol id="i-toolbox" viewBox="0 0 24 24"><rect x="2.5" y="8" width="19" height="12.5" rx="2.2" /><path d="M8.5 8V6.2a2.2 2.2 0 0 1 2.2-2.2h2.6A2.2 2.2 0 0 1 15.5 6.2V8" /><path d="M2.5 13.2h19" /><path d="M9.6 11.4v3.6M14.4 11.4v3.6" /></symbol>
        <symbol id="i-nut" viewBox="0 0 24 24"><path d="M12 2.6 20.4 7.3v9.4L12 21.4 3.6 16.7V7.3z" /><circle cx="12" cy="12" r="3.2" /></symbol>
        <symbol id="i-branch" viewBox="0 0 24 24"><circle cx="7" cy="5.6" r="2.3" /><circle cx="7" cy="18.4" r="2.3" /><circle cx="17" cy="8.6" r="2.3" /><path d="M7 7.9v8.2" /><path d="M17 10.9c0 3.5-2.9 4.7-5.8 5.2" /></symbol>
        <symbol id="i-link" viewBox="0 0 24 24"><path d="M10.4 13.6a4.6 4.6 0 0 0 6.5 0l2.4-2.4a4.6 4.6 0 0 0-6.5-6.5l-1.3 1.3" /><path d="M13.6 10.4a4.6 4.6 0 0 0-6.5 0l-2.4 2.4a4.6 4.6 0 0 0 6.5 6.5l1.3-1.3" /></symbol>
        <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.6" /><path d="M12 6.9v5.3l3.3 2" /></symbol>
        <symbol id="i-download" viewBox="0 0 24 24"><path d="M12 3.2v11.4" /><path d="M7.6 10.4 12 14.8l4.4-4.4" /><path d="M4 17.4v1.6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.6" /></symbol>
        <symbol id="i-mail" viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M3.2 7.4 12 13.9l8.8-6.5" /></symbol>
        <symbol id="i-linkedin" viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="3.6" /><path d="M7.3 10.6v6.8" /><circle cx="7.3" cy="7.1" r="1.15" /><path d="M11.6 17.4v-6.8" /><path d="M11.6 13.6a2.9 2.9 0 0 1 5.8 0v3.8" /></symbol>
        <symbol id="i-bars" viewBox="0 0 24 24"><path d="M6 20.5V11.5M12 20.5V3.5M18 20.5V15" strokeWidth="2.6" /></symbol>
        <symbol id="i-chef" viewBox="0 0 24 24"><path d="M7.4 21h9.2M7.4 17.9h9.2" /><path d="M8.1 17.9c-2.7 0-4.6-2-4.6-4.7 0-2.2 1.7-3.9 3.9-3.9.6-2.2 2.5-3.3 4.6-3.3s4 1.1 4.6 3.3c2.2 0 3.9 1.7 3.9 3.9 0 2.7-1.9 4.7-4.6 4.7" /></symbol>
        <symbol id="i-brackets" viewBox="0 0 24 24"><path d="M8.8 4.6 3.4 12l5.4 7.4" /><path d="M15.2 4.6 20.6 12l-5.4 7.4" /><path d="M13.4 3.2 10.6 20.8" /></symbol>
        <symbol id="i-rocket" viewBox="0 0 24 24"><path d="M12 2.4c2.8 2.5 4.3 5.7 4.3 9.2 0 3-1.4 5.6-4.3 7.7-2.9-2.1-4.3-4.7-4.3-7.7 0-3.5 1.5-6.7 4.3-9.2z" /><circle cx="12" cy="10.2" r="1.8" /><path d="M7.9 14.7 4.9 17.3l1 3.5 2.6-1.6M16.1 14.7l3 2.6-1 3.5-2.6-1.6" /></symbol>
        <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2" /><path d="M12 1.9v2.7M12 19.4v2.7M1.9 12h2.7M19.4 12h2.7M4.9 4.9l1.9 1.9M17.2 17.2l1.9 1.9M19.1 4.9l-1.9 1.9M6.8 17.2l-1.9 1.9" /></symbol>
        <symbol id="i-palette" viewBox="0 0 24 24"><rect x="3.4" y="3.4" width="7.4" height="7.4" rx="1.9" /><rect x="13.2" y="3.4" width="7.4" height="7.4" rx="1.9" /><rect x="3.4" y="13.2" width="7.4" height="7.4" rx="1.9" /><rect x="13.2" y="13.2" width="7.4" height="7.4" rx="1.9" /></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><path d="M4.5 12.5 9.5 17.5 19.5 7" /></symbol>
        <symbol id="i-moon" viewBox="0 0 24 24"><path d="M20.5 14.6A8.8 8.8 0 0 1 9.4 3.5a8.8 8.8 0 1 0 11.1 11.1z" /></symbol>
        <symbol id="i-eye" viewBox="0 0 24 24"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></symbol>
        <symbol id="i-github" viewBox="0 0 24 24"><path d="M12 1.8a10.2 10.2 0 0 0-3.23 19.88c.51.09.7-.22.7-.49l-.01-1.9c-2.84.62-3.44-1.2-3.44-1.2-.47-1.18-1.14-1.5-1.14-1.5-.93-.63.07-.62.07-.62 1.03.07 1.57 1.06 1.57 1.06.91 1.57 2.4 1.12 2.99.86.09-.66.36-1.12.65-1.38-2.27-.26-4.65-1.14-4.65-5.06 0-1.12.4-2.03 1.05-2.75-.1-.26-.46-1.3.1-2.71 0 0 .86-.28 2.81 1.05a9.7 9.7 0 0 1 5.12 0c1.95-1.33 2.81-1.05 2.81-1.05.56 1.41.21 2.45.1 2.71.66.72 1.05 1.63 1.05 2.75 0 3.93-2.38 4.8-4.66 5.05.37.32.69.94.69 1.9l-.01 2.82c0 .27.19.59.71.49A10.2 10.2 0 0 0 12 1.8z" /></symbol>
        <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21.5s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" /><circle cx="12" cy="10.3" r="2.6" /></symbol>
        <symbol id="i-layers" viewBox="0 0 24 24"><path d="M12 2.8 21.2 7.6 12 12.4 2.8 7.6z" /><path d="M2.8 12 12 16.8 21.2 12" /><path d="M2.8 16.4 12 21.2 21.2 16.4" /></symbol>
        <symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3.2" y="5" width="17.6" height="16" rx="2.6" /><path d="M3.2 9.6h17.6" /><path d="M8 2.8v4M16 2.8v4" /></symbol>
        <symbol id="i-award" viewBox="0 0 24 24"><circle cx="12" cy="9" r="5.6" /><path d="M8.4 13.6 7 21.4l5-2.6 5 2.6-1.4-7.8" /></symbol>
        <symbol id="i-book" viewBox="0 0 24 24"><path d="M4 4.4h5.6A2.9 2.9 0 0 1 12 6.6v13a2.4 2.4 0 0 0-2.4-1.8H4z" /><path d="M20 4.4h-5.6A2.9 2.9 0 0 0 12 6.6v13a2.4 2.4 0 0 1 2.4-1.8H20z" /></symbol>
        <symbol id="i-arrow-left" viewBox="0 0 24 24"><path d="M20 12H4.6" /><path d="M10.6 5.8 4.4 12l6.2 6.2" /></symbol>
        <symbol id="i-arrow-right" viewBox="0 0 24 24"><path d="M4 12h15.4" /><path d="M13.4 5.8 19.6 12l-6.2 6.2" /></symbol>
        {/* ===== brand marks for the Skills & tools tiles (simplified, single-colour) ===== */}
        <symbol id="i-copy" viewBox="0 0 24 24"><rect x="9" y="9" width="11.6" height="11.6" rx="2.6" /><path d="M15.6 6.2V5.4a2 2 0 0 0-2-2H5.4a2 2 0 0 0-2 2v8.2a2 2 0 0 0 2 2h.8" /></symbol>
        <symbol id="i-phone" viewBox="0 0 24 24"><path d="M8.5 3.4H6A2.5 2.5 0 0 0 3.5 6c.3 9.1 5.4 14.2 14.5 14.5A2.5 2.5 0 0 0 20.5 18v-2.5l-4.4-1.7-2 2a13.7 13.7 0 0 1-5.5-5.5l2-2z" /></symbol>
        <symbol id="b-react" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.9" fill="currentColor" stroke="none" /><ellipse cx="12" cy="12" rx="9.6" ry="4.1" /><ellipse cx="12" cy="12" rx="9.6" ry="4.1" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="9.6" ry="4.1" transform="rotate(120 12 12)" /></symbol>
        <symbol id="b-js" viewBox="0 0 24 24"><rect x="2.6" y="2.6" width="18.8" height="18.8" rx="4.6" /><text x="12" y="16" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontSize="9.6" fontWeight="700" fill="currentColor" stroke="none">JS</text></symbol>
        <symbol id="b-html5" viewBox="0 0 24 24"><path d="M4.4 3h15.2l-1.4 15.9L12 21l-6.2-2.1z" /><text x="12" y="15.4" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontSize="8.8" fontWeight="700" fill="currentColor" stroke="none">5</text></symbol>
        <symbol id="b-css3" viewBox="0 0 24 24"><path d="M4.4 3h15.2l-1.4 15.9L12 21l-6.2-2.1z" /><text x="12" y="15.4" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontSize="8.8" fontWeight="700" fill="currentColor" stroke="none">3</text></symbol>
        <symbol id="b-vercel" viewBox="0 0 24 24"><path d="M12 3.4 21.6 20.4H2.4z" fill="currentColor" stroke="none" /></symbol>
        <symbol id="b-netlify" viewBox="0 0 24 24"><path d="M12 2.6 21.4 12 12 21.4 2.6 12z" /><path d="M12 8.6 15.4 12 12 15.4 8.6 12z" fill="currentColor" stroke="none" /></symbol>
        <symbol id="b-django" viewBox="0 0 24 24"><rect x="2.6" y="2.6" width="18.8" height="18.8" rx="4.6" /><text x="12" y="16" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontSize="9.6" fontWeight="700" fill="currentColor" stroke="none">dj</text></symbol>
        <symbol id="b-drf" viewBox="0 0 24 24"><rect x="2.2" y="4.4" width="19.6" height="15.2" rx="3.8" /><text x="12" y="15" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontSize="7" fontWeight="700" fill="currentColor" stroke="none">DRF</text></symbol>
        <symbol id="b-rest" viewBox="0 0 24 24"><path d="M8.6 5 3.4 12l5.2 7" /><path d="M15.4 5l5.2 7-5.2 7" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /></symbol>
        <symbol id="b-postgres" viewBox="0 0 24 24"><ellipse cx="12" cy="5.9" rx="7.5" ry="3.1" /><path d="M4.5 5.9v12.2c0 1.7 3.4 3.1 7.5 3.1s7.5-1.4 7.5-3.1V5.9" /><path d="M4.5 12c0 1.7 3.4 3.1 7.5 3.1s7.5-1.4 7.5-3.1" /></symbol>
        <symbol id="b-neon" viewBox="0 0 24 24"><ellipse cx="12" cy="5.9" rx="7.5" ry="3.1" /><path d="M4.5 5.9v12.2c0 1.7 3.4 3.1 7.5 3.1s7.5-1.4 7.5-3.1V5.9" /><path d="M13.4 8.4 9.5 13.9h2.9l-1.8 4.4 4.4-5.7h-3.1z" fill="currentColor" stroke="none" /></symbol>
        <symbol id="b-supabase" viewBox="0 0 24 24"><path d="M13.2 2.6 5.3 12.1c-.5.6-.1 1.5.7 1.5h5.2v7.8l7.9-9.5c.5-.6.1-1.5-.7-1.5h-5.2z" fill="currentColor" stroke="none" /></symbol>
        <symbol id="b-render" viewBox="0 0 24 24"><path d="M7.6 18.4a4.4 4.4 0 0 1-.6-8.8 5.5 5.5 0 0 1 10.5 1.1 3.9 3.9 0 0 1-.6 7.7" /><path d="M12 21.4v-7.6M9.4 16.2 12 13.6l2.6 2.6" /></symbol>
        <symbol id="b-python" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" fillRule="evenodd" d="M12 2.6c-2.2 0-4.4.3-4.4 2.5v2.5h4.6v.8H5.6C3.4 8.4 2.5 9.7 2.5 12s.9 3.6 3.1 3.6h1.6v-2.4c0-2.1 1.8-3.8 3.9-3.8h4c1.8 0 3.2-1.4 3.2-3.2V5.1c0-1.9-1.9-2.5-4.3-2.5zm-2.4 1.7a.95.95 0 1 0 0 1.9.95.95 0 1 0 0-1.9z" /><path fill="currentColor" stroke="none" fillRule="evenodd" transform="rotate(180 12 12)" d="M12 2.6c-2.2 0-4.4.3-4.4 2.5v2.5h4.6v.8H5.6C3.4 8.4 2.5 9.7 2.5 12s.9 3.6 3.1 3.6h1.6v-2.4c0-2.1 1.8-3.8 3.9-3.8h4c1.8 0 3.2-1.4 3.2-3.2V5.1c0-1.9-1.9-2.5-4.3-2.5zm-2.4 1.7a.95.95 0 1 0 0 1.9.95.95 0 1 0 0-1.9z" /></symbol>
        <symbol id="b-c" viewBox="0 0 24 24"><rect x="2.2" y="4.4" width="19.6" height="15.2" rx="4" /><text x="12" y="15.4" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontSize="8.6" fontWeight="700" fill="currentColor" stroke="none">C</text></symbol>
        <symbol id="b-cpp" viewBox="0 0 24 24"><rect x="2.2" y="4.4" width="19.6" height="15.2" rx="4" /><text x="12" y="15.2" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontSize="7.4" fontWeight="700" fill="currentColor" stroke="none">C++</text></symbol>
        <symbol id="b-go" viewBox="0 0 24 24"><rect x="2.2" y="4.4" width="19.6" height="15.2" rx="4" /><text x="12" y="15.2" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontSize="8" fontWeight="700" fill="currentColor" stroke="none">GO</text></symbol>
        <symbol id="b-sql" viewBox="0 0 24 24"><rect x="2.8" y="4.4" width="18.4" height="15.2" rx="2.8" /><path d="M2.8 9.4h18.4M2.8 14.5h18.4M9.4 9.4v10.2M15.4 9.4v10.2" /></symbol>
        <symbol id="b-git" viewBox="0 0 24 24"><path d="M11.3 2.7 2.7 11.3a1 1 0 0 0 0 1.4l8.6 8.6a1 1 0 0 0 1.4 0l8.6-8.6a1 1 0 0 0 0-1.4l-8.6-8.6a1 1 0 0 0-1.4 0z" /><circle cx="14.9" cy="9.1" r="1.45" /><circle cx="14.9" cy="14.9" r="1.45" /><circle cx="9.1" cy="14.9" r="1.45" /><path d="M14.9 10.6v2.9M13.4 14.9h-2.8" /></symbol>
        <symbol id="b-github" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M12 1.8a10.2 10.2 0 0 0-3.23 19.88c.51.09.7-.22.7-.49l-.01-1.9c-2.84.62-3.44-1.2-3.44-1.2-.47-1.18-1.14-1.5-1.14-1.5-.93-.63.07-.62.07-.62 1.03.07 1.57 1.06 1.57 1.06.91 1.57 2.4 1.12 2.99.86.09-.66.36-1.12.65-1.38-2.27-.26-4.65-1.14-4.65-5.06 0-1.12.4-2.03 1.05-2.75-.1-.26-.46-1.3.1-2.71 0 0 .86-.28 2.81 1.05a9.7 9.7 0 0 1 5.12 0c1.95-1.33 2.81-1.05 2.81-1.05.56 1.41.21 2.45.1 2.71.66.72 1.05 1.63 1.05 2.75 0 3.93-2.38 4.8-4.66 5.05.37.32.69.94.69 1.9l-.01 2.82c0 .27.19.59.71.49A10.2 10.2 0 0 0 12 1.8z" /></symbol>
        <symbol id="b-vscode" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" fillRule="evenodd" d="M17.7 2.4 21 4.1v15.8l-3.3 1.7-8.6-8.3-4.2 3.2L3 15.2 6.9 12 3 8.8l1.9-1.3 4.2 3.2zm-.3 5L11.6 12l5.8 4.6z" /></symbol>
        <symbol id="b-arduino" viewBox="0 0 24 24"><path d="M2.6 12a4.5 4.5 0 0 1 4.5-4.5c3.9 0 5.5 9 9.4 9a4.5 4.5 0 0 0 0-9c-3.9 0-5.5 9-9.4 9A4.5 4.5 0 0 1 2.6 12z" /><path d="M5.5 12h3.2M15.3 12h3.2M16.9 10.4v3.2" /></symbol>
        <symbol id="b-platformio" viewBox="0 0 24 24"><path d="M12 2.8 20.2 7.4v9.2L12 21.2 3.8 16.6V7.4z" /><circle cx="12" cy="12" r="3.1" /><path d="M12 2.8v4.1M12 17.1v4.1" /></symbol>
      </defs>
    </svg>
  );
}
