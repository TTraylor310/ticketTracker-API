const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')
const Note = require('../models/noteModel')

// @desc - Get notes for a ticket
// @route GET - /api/tickets/:ticketID/notes
// @access PRIVATE
const getNotes = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.ticketId)
  if (ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized, check correct user')
  }

  const notes = await Note.find({ ticket: req.params.ticketId })
  res.status(200).json(notes)
})

// @desc - Create ticket note
// @route - POST - /api/tickets/:ticketId/notes
// @access - PRIVATE
const addNote = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.ticketId)
  if (ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized, check user is correct')
  }

  const note = await Note.create({
    text: req.body.text,
    isStaff: false,
    ticket: req.params.ticketId,
    user: req.user.id,
  })
  res.status(201).json(note)
})

module.exports = {
  getNotes,
  addNote,
}
