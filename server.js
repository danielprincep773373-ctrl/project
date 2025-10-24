const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');
const Song = require('./models/Song');
const Playlist = require('./models/Playlist');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error(err));

// 🧍 User Routes
app.post('/users', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// 🎵 Song Routes
app.post('/songs', async (req, res) => {
  const song = await Song.create(req.body);
  res.json(song);
});

app.get('/songs', async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
});

// 📀 Playlist Routes
app.post('/playlists', async (req, res) => {
  const playlist = await Playlist.create(req.body);
  res.json(playlist);
});

app.get('/playlists', async (req, res) => {
  const playlists = await Playlist.find().populate('songs').populate('user');
  res.json(playlists);
});

// ➕ Add song to playlist
app.post('/playlists/:id/addSong', async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  playlist.songs.push(req.body.songId);
  await playlist.save();
  res.json(playlist);
});

// ➖ Remove song from playlist
app.post('/playlists/:id/removeSong', async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  playlist.songs = playlist.songs.filter(id => id.toString() !== req.body.songId);
  await playlist.save();
  res.json(playlist);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
