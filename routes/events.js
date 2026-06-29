const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');

router.get('/', auth, async (req,res)=> res.json(await Event.find().populate('client menuItems').sort('-date')) );
router.post('/', auth, async (req,res)=>{ const e = new Event(req.body); await e.save(); res.status(201).json(e); });
router.put('/:id', auth, async (req,res)=>{ const e = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(e); });

module.exports = router;
