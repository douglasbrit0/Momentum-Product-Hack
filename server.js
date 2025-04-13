const express = require('express'); const mongoose = require('mongoose'); const app = express(); const port = process.env.PORT || 3000;

// Connect to MongoDB (replace <connection-string> with your actual connection URI) mongoose.connect('mongodb://localhost:27017/momentum', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection; db.on('error', console.error.bind(console, 'connection error:')); db.once('open', () => { console.log('Connected to MongoDB'); });

// Define schema for tester profiles const testerSchema = new mongoose.Schema({ email: { type: String, required: true, unique: true }, password: { type: String, required: true } // In production, always hash passwords! });

const Tester = mongoose.model('Tester', testerSchema);

// Define schema for roles (optional, you might store role info as part of a user model) const roleSchema = new mongoose.Schema({ role: { type: String, required: true } });

const Role = mongoose.model('Role', roleSchema);

// Middleware to parse JSON bodies app.use(express.json());

// Endpoint to save role app.post('/api/save-role', async (req, res) => { const { role } = req.body; if (!role) { return res.status(400).json({ error: 'Role is required' }); } try { const newRole = new Role({ role }); await newRole.save(); res.status(200).json({ message: 'Role saved successfully' }); } catch (err) { console.error(err); res.status(500).json({ error: 'Error saving role' }); } });

// Endpoint to create tester profile (with email and password) app.post('/api/create-profile', async (req, res) => { const { email, password } = req.body; if (!email || !password) { return res.status(400).json({ error: 'Email and password are required' }); } try { // Before saving, consider hashing the password with bcrypt const newTester = new Tester({ email, password }); await newTester.save(); res.status(200).json({ message: 'Tester profile created successfully' }); } catch (err) { console.error(err); res.status(500).json({ error: 'Error creating profile' }); } });

// Basic route for testing app.get('/', (req, res) => { res.send('Hello from Momentum Product Hack backend!'); });