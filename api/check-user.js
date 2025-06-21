import { checkAuth } from './_helpers';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { id, password } = req.query;
  const auth = await checkPlayerAccess(id);
  if (!auth.valid) {
    res.status(401).json({ message: auth.message });
    return;
  }

  // Return JSON with variable values only
  res.status(200).json({    
    valid: true
  });
}
