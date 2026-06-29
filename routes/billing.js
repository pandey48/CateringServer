const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Invoice = require('../models/Invoice');

router.post('/', auth, async (req,res)=>{ const inv = new Invoice(req.body); await inv.save(); res.status(201).json(inv); });
router.get('/', auth, async (req,res)=> res.json(await Invoice.find().populate('event')));

module.exports = router;
