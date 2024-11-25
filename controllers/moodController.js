const Mood = require('../models/Mood')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

// get all moods
const getMoods = async (req, res) => {
	const moods = await Mood.find({ user: req.user.userId }).sort('createdAt')
	res.status(StatusCodes.OK).json({ moods })
}

const createMood = async (req, res) => {
	req.body.user = req.user.userId
	const mood = await Mood.create(req.body)
	res.status(StatusCodes.CREATED).json({ mood })
}

const getMood = async (req, res) => {
	const { id: moodId } = req.params
	const mood = await Mood.findOne({ _id: moodId, user: req.user.userId })
	if (!mood) {
		throw new CustomError.NotFoundError(`No mood with id : ${moodId}`)
	}
	res.status(StatusCodes.OK).json({ mood })
}

const updateMood = async (req, res) => {
	const { id: moodId } = req.params
	const mood = await Mood.findOneAndUpdate(
		{ _id: moodId, user: req.user.userId },
		req.body,
		{ new: true, runValidators: true }
	)
	if (!mood) {
		throw new CustomError.NotFoundError(`No mood with id : ${moodId}`)
	}
	res.status(StatusCodes.OK).json({ mood })
}

const deleteMood = async (req, res) => {
	const { id: moodId } = req.params
	const mood = await Mood.findOneAndDelete({
		_id: moodId,
		user: req.user.userId,
	})
	if (!mood) {
		throw new CustomError.NotFoundError(`No mood with id : ${moodId}`)
	}
	res.status(StatusCodes.OK).json({ mood })
}

const deleteMultipleMoods = async (req, res) => {
	const { ids } = req.body
	const moods = await Mood.deleteMany({
		_id: { $in: ids },
		user: req.user.userId,
	})
	if (!moods) {
		throw new CustomError.NotFoundError(`No moods with ids : ${ids}`)
	}
	res.status(StatusCodes.OK).json({ moods })
}

module.exports = {
	getMoods,
	createMood,
	getMood,
	updateMood,
	deleteMood,
	deleteMultipleMoods,
}
