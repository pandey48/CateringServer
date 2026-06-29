const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Client = require('../models/Client');

router.get('/', auth, async (req,res)=> res.json(await Client.find().sort('-createdAt')) );
router.post('/', auth, async (req,res)=>{ const c = new Client(req.body); await c.save(); res.status(201).json(c); });

module.exports = router;
