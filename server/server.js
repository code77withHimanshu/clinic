const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define Doctor Schema
const doctorSchema = new mongoose.Schema({
  name: String,
  qualification: String,
  description: String,
  image_url: String
});

// Define Slot Schema
const slotSchema = new mongoose.Schema({
    morning: {
      slots: [
        {
          time: String,
          is_selected: { type: Boolean, default: false },
          is_occupied: { type: Boolean, default: false }
        }
      ]
    },
    afternoon: {
      slots: [
        {
          time: String,
          is_selected: { type: Boolean, default: false },
          is_occupied: { type: Boolean, default: false }
        }
      ]
    },
    evening: {
      slots: [
        {
          time: String,
          is_selected: { type: Boolean, default: false },
          is_occupied: { type: Boolean, default: false }
        }
      ]
    }
  });

// Create Models
const Doctor = mongoose.model('Doctor', doctorSchema);
const Slot = mongoose.model('Slot', slotSchema);

// API to get all doctors
app.get('/api/doctors', async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
});

// API to get all slots
app.get('/api/slots', async (req, res) => {
    try {
      const slots = await Slot.find();
      res.json(slots);
    } catch (err) {
      console.error('Error fetching slots:', err);
      res.status(500).json({ message: 'Error fetching slots' });
    }
  });

// API to add a new doctor
app.post('/api/doctors', async (req, res) => {
  const doctor = new Doctor(req.body);
  await doctor.save();
  res.json(doctor);
});

// API to delete a doctor
app.delete('/api/doctors/:id', async (req, res) => {
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ message: 'Doctor deleted' });
});

// Route for updating a specific slot
app.put('/api/slots/update', async (req, res) => {
    const { period, time, updatedSlot } = req.body;
  
    try {
      // Find and update the slot in the specified period and time
      const updatedDocument = await Slot.findOneAndUpdate(
        { [`${period}.slots.time`]: time }, // Condition to find the specific slot
        { $set: { [`${period}.slots.$`]: updatedSlot } }, // Update the slot
        { new: true } // Return the updated document
      );
  
      if (!updatedDocument) {
        return res.status(404).send('Slot not found');
      }
  
      res.status(200).json(updatedDocument); // Return the updated slot document
      console.log(updatedDocument);
    } catch (err) {
      console.error('Error updating slot:', err);
      res.status(500).send('Error updating slot');
    }
  });


  app.post('/api/slots/add', async (req, res) => {
    const { period, newSlot } = req.body;
  
    console.log('Request body:', req.body);
  
    // Validate required fields
    if (!period || !newSlot || !newSlot.time) {
      return res.status(400).send('Invalid request. "period" and "newSlot.time" are required.');
    }
  
    try {
      // Update the specific period's slots array
      const updatedDocument = await Slot.findOneAndUpdate(
        { [`${period}`]: { $exists: true } }, // Ensure the period exists
        { $push: { [`${period}.slots`]: newSlot } }, // Push the new slot to the appropriate array
        { new: true } // Return the updated document
      );
  
      if (!updatedDocument) {
        return res.status(404).send(`Period "${period}" not found`);
      }
  
      console.log('Slot added successfully:', newSlot);
      res.status(201).json(updatedDocument); // Return the updated document
    } catch (err) {
      console.error('Error adding slot:', err);
      res.status(500).send('An error occurred while adding the slot');
    }
  });

  app.delete('/api/slots/delete', async (req, res) => {
    const { period, time } = req.body; // Accept period and time from the request body
  
    if (!period || !time) {
      return res.status(400).send('Invalid request. "period" and "time" are required.');
    }
  
    try {
      const updatedDocument = await Slot.findOneAndUpdate(
        {},
        { $pull: { [`${period}.slots`]: { time: time } } }, 
        { new: true }
      );
  
      if (!updatedDocument) {
        return res.status(404).send('Slot or period not found');
      }
  
      res.status(200).json(updatedDocument);
      console.log(`Slot with time "${time}" deleted from "${period}" period.`);
    } catch (err) {
      console.error('Error deleting slot:', err);
      res.status(500).send('Error deleting slot');
    }
  });
  

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
