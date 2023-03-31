const { response } = require('express');
const Event = require('../models/Event');

const getEvents = async (req, res = response) => {
  const events = await Event.find().populate('user', 'name');

  res.json({
    ok: true,
    msg: events,
  });
};

const createEvent = async (req, res = response) => {
  const event = new Event(req.body);

  try {
    event.user = req.uid;

    const savedEvent = await event.save();

    res.json({
      ok: true,
      savedEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Talk to administrator',
    });
  }
};

const updateEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);

    if (!event) res.status(404).json({ ok: false, msg: 'Event not found' });

    if (event.user.toString() !== uid)
      return res.status(401).json({ ok: false, msg: "You don't have permission to update this event" });

    const newEvent = { ...req.body, user: uid };

    const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, { new: true });

    res.json({
      ok: true,
      event: updatedEvent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Talk to administrator',
    });
  }
};

const deleteEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);

    if (!event) res.status(404).json({ ok: false, msg: 'Event not found' });

    if (event.user.toString() !== uid)
      return res.status(401).json({ ok: false, msg: "You don't have permission to delete this event" });

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    res.json({
      ok: true,
      eventDeleted: deletedEvent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Talk to administrator',
    });
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
