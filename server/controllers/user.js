import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Helper function for DES encryption
const encryptWithDES = (text, secretKey) => {
    const cipher = crypto.createCipher('des', secretKey);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

// Helper function for DES decryption
const decryptWithDES = (encryptedText, secretKey) => {
    const decipher = crypto.createDecipher('des', secretKey);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser)
            return res.status(404).json({ message: "User doesn't exist." });

        // Decrypt the stored password using the same key used for encryption
        const decryptedPassword = decryptWithDES(existingUser.password, 'yourSecretKey');
        const isPasswordCorrect = password === decryptedPassword;

        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Invalid credentials." });

        const token = jwt.sign({ name: existingUser.name, email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" });
        res.status(200).json({ result: existingUser, token: token });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
}

export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName, role = "user" } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exist." });
        }

        if (password !== confirmPassword)
            return res.status(400).json({ message: "Passwords don't match." });

        // Encrypt the password using DES encryption
        const encryptedPassword = encryptWithDES(password, 'yourSecretKey');

        const result = await User.create({ email, password: encryptedPassword, name: `${firstName} ${lastName}`, role });
        const token = jwt.sign({ name: result.name, email: result.email, id: result._id }, 'test', { expiresIn: "1h" });
        res.status(200).json({ result: result, token: token });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
}

export const microsoftSignin = async (req, res) => {
    const { email, name } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        res.status(200).json({ result: existingUser });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
}

export const microsoftSignup = async (req, res) => {
    const { email, name } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return microsoftSignin(req, res);
        }
        const result = await User.create({ email: email, name: name });
        res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
}