import { checkAuth } from './_helpers';

const injectScriptCodeString = `
function injectScript(src, onload) {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(src);
  script.type = 'text/javascript';
  script.onload = function () {
    this.remove();
    if (onload) onload();
  };
  document.documentElement.appendChild(script);
}

// Inject jQuery first, then socket.io, then main.js
injectScript('lib/jquery-3.7.1.min.js', () => {
  injectScript('lib/payload.js', () => {
    injectScript('lib/notpayload.js');
  });
});
`;

export default async function handler(req, res) {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*'); // or restrict to specific origins
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { id, password } = req.query;
  const auth = await checkAuth(id, password);
  if (!auth.valid) {
    res.status(401).json({ message: auth.message });
    return;
  }

  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(injectScriptCodeString);
}