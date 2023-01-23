const asyncHandler = require('express-async-handler')
const Ticket = require('../models/ticketModel')

// @desc - create ticket for 'user'
// @route - POST - /api/tickets
// @access - PRIVATE
const createTicket = asyncHandler(async (req, res) => {
  const { product, description } = req.body
  if (!product || !description) {
    res.status(400)
    throw new Error('Please add a product and description')
  }
  const ticket = await Ticket.create({
    product,
    description,
    user: req.user.id,
    status: 'new',
  })
  res.status(201).json(ticket)
})

// @desc - Get ALL tickets for 'user'
// @route - GET - /api/tickets
// @access - PRIVATE
const getTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ user: req.user.id })
  res.status(200).json(tickets)
})

// @desc - Get one ticket for 'user'
// @route - GET - /api/tickets/:id
// @access - PRIVATE
const getTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
  if (!ticket) {
    res.status(404)
    throw new Error('Ticket number not found in database')
  }
  if (ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not Authorized')
  }
  res.status(200).json(ticket)
})

// @desc - delete one ticket for 'user'
// @route - DELETE - /api/tickets/:id
// @access - PRIVATE
const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findByIdAndDelete(req.params.id)
  if (!ticket) {
    res.status(404)
    throw new Error('Ticket number not found in database')
  }
  if (ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('You do not have permission to delete this ticket')
  }
  res.status(200).json({ success: true })
})

// @desc - update one ticket for 'user'
// @route - PUT - /api/tickets/:id
// @access - PRIVATE
const updateTicket = asyncHandler(async(req, res) => {
  const ticket = await Ticket.findById(req.params.id)
  if (!ticket) {
    res.status(404)
    throw new Error('Ticket number not found in database')
  }
  if (ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('You do not have permission to update this ticket')
  }
  const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {new: true})
  res.status(200).json(updatedTicket)
})

module.exports = {
  createTicket,
  getTickets,
  getTicket,
  deleteTicket,
  updateTicket,
}
