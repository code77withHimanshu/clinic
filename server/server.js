const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://test:test123@clinic-appointment.62kve.mongodb.net/', {
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
  

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
