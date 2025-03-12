const Contact = require("../models/contact-model");

const contactForm = async (req, res) => {
  try {
    const { username, email, message } = req.body;

    // Validate the input
    if (!username || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new contact entry
    await Contact.create({ username, email, message });

    // Respond with success
    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Message not sent" });
  }
};

module.exports = contactForm;
