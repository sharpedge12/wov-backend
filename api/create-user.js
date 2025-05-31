import { User } from './_helpers';

export default async function handler(req, res) {

    // Set CORS headers for all requests
    res.setHeader('Access-Control-Allow-Origin', '*'); // or restrict to specific origins
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { admin_pass, id, password, time_duration } = req.body;

  if (admin_pass !== process.env.MY_PASSWORD) {
    res.status(403).json({ message: 'Forbidden: Incorrect admin password' });
    return;
  }

  if (!id || !password || !time_duration) {
    res.status(400).json({ message: 'Missing id, password or time_duration' });
    return;
  }

  try {
    const now = Date.now();
    const result = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          password,
          alloted_date: now,
          alloted_time: time_duration,
        },
      },
      { upsert: true, new: true }
    );
    res.json({ message: 'User created or updated successfully', user: result });
  } catch (error) {
    console.error('Create/update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
