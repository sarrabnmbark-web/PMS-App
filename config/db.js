// config/db.js - Version minimale mais efficace
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Ajouter les paramètres directement dans l'URI
        const uri = process.env.MONGO_URI + "?retryWrites=true&w=majority";
        
        const conn = await mongoose.connect(uri);
        
        console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
        console.log(`📁 Base de données: ${conn.connection.name}`);
        
    } catch (error) {
        console.error(`❌ Erreur: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;