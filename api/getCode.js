import { checkAuth } from './_helpers';

export default async function handler(req, res) {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
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

  // Return only variable declarations
  const injectVarsString = `
    let var1 = 'lib/defpayload.js';
    let var2 = 'lib/payload.js';
    let var3 = 'lib/notpayload.js';
  `;

  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(injectVarsString.trim());
}
