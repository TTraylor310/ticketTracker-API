const express = require('express')
const router = express.Router()

const { protect } = require('../middleware/authMiddleware')
const {
  createTicket,
  getTickets,
  getTicket,
  deleteTicket,
} = require('../controllers/ticketController')

router.route('/')
  .get(protect, getTickets)
  .post(protect, createTicket)
router.route('/:id')
  .get(protect, getTicket)
  .delete(protect, deleteTicket)

module.exports = router
