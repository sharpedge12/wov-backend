import fs from 'fs';
import path from 'path';
import { checkAuth } from './_helpers';

export default async function handler(req, res) {
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

  const filePath = path.join(process.cwd(), 'mainbomb.js');
  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
      res.status(500).json({ message: 'Script file not found or inaccessible' });
      return;
    }
    res.setHeader('Content-Type', 'application/javascript');
    fs.createReadStream(filePath).pipe(res);
  });
}
