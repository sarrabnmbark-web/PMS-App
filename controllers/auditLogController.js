const AuditLog = require('../models/AuditLogs');

exports.createLog = async (user_id, action, entity) => {
    try {
        await AuditLog.create({
            user_id,
            action,
            entity,
            timestamp
        });
    } catch (error) {
        console.error("Erreur AuditLog:", error.message);
    }
};