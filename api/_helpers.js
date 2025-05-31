// api/_helpers.js
import mongoose from 'mongoose';

if (!mongoose.connections[0].readyState) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const userSchema = new mongoose.Schema({
  _id: String,
  password: String,
  alloted_date: Number,
  alloted_time: Number,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function checkAuth(id, password) {
  if (!id || !password) {
    return { valid: false, message: 'Missing id or password' };
  }
  const user = await User.findById(id);
  if (!user) return { valid: false, message: 'User not found' };
  if (user.password !== password) return { valid: false, message: 'Wrong password' };
  if (Date.now() - user.alloted_date > user.alloted_time) return { valid: false, message: 'Access expired' };
  return { valid: true, user };
}

export { User, checkAuth };
