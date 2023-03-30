/*
    Event Routes
    /api/events
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const router = Router();
const { validateJwt } = require('../middlewares/validate-jwt');
const { isDate } = require('../helpers/isDate');

// All need to be validated through jwt
router.use(validateJwt);

// Get events
router.get('/', getEvents);

// Create new event
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('start', 'Start date is required').custom(isDate),
    check('end', 'End date is required').custom(isDate),
    validateFields,
  ],
  createEvent
);

// Update event
router.put(
  '/:id',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('start', 'Start date is required').custom(isDate),
    check('end', 'End date is required').custom(isDate),
    validateFields,
  ],
  updateEvent
);

// Delete event
router.delete('/:id', deleteEvent);

module.exports = router;
