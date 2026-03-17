const User = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Générer un token JWT valide pour 30 jours
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Créer un nouvel utilisateur (Register)
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role_id } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
        }

        // Créer l'utilisateur (le mot de passe sera haché automatiquement par le Model)
        const user = await User.create({ name, email, password, role_id });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Connecter un utilisateur (Login)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Chercher l'utilisateur par son email
        const user = await User.findOne({ email });

        // Vérifier si l'utilisateur existe ET si le mot de passe correspond
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role_id: user.role_id,
                token: generateToken(user._id) // On renvoie le Token !
            });
        } else {
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };