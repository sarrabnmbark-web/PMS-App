const Client = require("../models/Client");



exports.createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ created_at: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }

    res.json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }

    res.json({ message: "Client supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};