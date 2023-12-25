import User from '../models/user.js';

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('name _id email role');
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getUsersBySearch = async (req, res) => {
    const { searchQuery } = req.query;
    try {
        const users = await User.find({ _id: { $in: searchQuery.split(',')} });
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateUser = async (req, res) => {
    const { _id, role } = req.body;

    try {
        const result = await User.findOneAndUpdate(
            { _id: _id }, 
            { role: role}, 
            { new: true, upsert: true }
        );
        
        res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
};

export const deleteUser = async (req, res) => {
    const { _id } = req.body;

    try {
        const result = await User.deleteOne({ _id: _id });
        res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
};