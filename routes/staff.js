const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Staff = require('../models/Staff');

router.get('/', auth, async (req,res)=> res.json(await Staff.find()) );
router.post('/', auth, async (req,res)=>{ const s = new Staff(req.body); await s.save(); res.status(201).json(s); });

module.exports = router;
