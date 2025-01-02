const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dbPassword = process.env.DB_PASSWORD;
const uri = `mongodb+srv://r2d2well:${dbPassword}@gradecalhub.59mpb.mongodb.net/?retryWrites=true&w=majority&appName=GradeCalHub`;

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

const User = require('./models/User');

app.get('/api/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    const available = !user; // true if user is not found
    res.json({ available });
  } catch (err) {
    console.error('Error checking username:', err);
    res.status(500).send('Server error');
  }
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.username;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

app.post('/calculators', authenticate, async (req, res) => {
  const username = req.user;
  const calculator = req.body;

  if (!calculator.name || !calculator.description) {
    return res.status(400).json({ error: 'Calculator name and description are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.calculators.push(calculator);
    await user.save();
    res.json({ message: 'Calculator saved successfully' });
  } catch (error) {
    console.error('Error saving calculator:', error);
    res.status(500).json({ error: 'Failed to save calculator' });
  }
});

app.delete('/calculators/:name', authenticate, async (req, res) => {
  try {
    const calculatorName = req.params.name;

    // Find the user and remove the calculator from the calculators array
    const updatedUser = await User.findOneAndUpdate(
      { username: req.user, "calculators.name": calculatorName },
      { $pull: { calculators: { name: calculatorName } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Calculator not found or unauthorized' });
    }

    res.json({ message: 'Calculator deleted successfully', calculators: updatedUser.calculators });
  } catch (err) {
    console.error('Error deleting calculator:', err);
    res.status(500).json({ error: 'Failed to delete the calculator' });
  }
});

// Route to get the list of JSON files and their contents
app.get('/calculators', authenticate, async (req, res) => {
  const username = req.user;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.calculators);
  } catch (error) {
    console.error('Error fetching calculators:', error);
    res.status(500).json({ error: 'Failed to fetch calculators' });
  }
});

app.get('/auth/user', authenticate, (req, res) => {
  res.json({ username: req.user });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
