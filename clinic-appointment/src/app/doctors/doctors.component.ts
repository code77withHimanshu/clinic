import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../doctor.service';
import { SlotService } from '../slot.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-doctors',
  imports: [CommonModule, FormsModule, TopBarComponent],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {
  doctors: any[] = [];
  slots: any[] = [];
  selectedDoctor: any = null;
  selectedSlot: any = null; // Track the selected slot

  constructor(
    private doctorService: DoctorService,
    private slotService: SlotService,
  ) {}

  ngOnInit(): void {
    // Fetch doctors data when the component is initialized
    this.getDoctors();

    // Fetch slots data when the component is initialized
    this.slotService.getSlots().subscribe({
      next: (data: any) => {
        this.slots = data;
      },
      error: (err) => {
        console.error('Error fetching slots:', err);
      }
    });
  }

  // Method to select a doctor
  selectDoctor(doctor: any): void {
    this.selectedDoctor = doctor;
  }

  // Method to select a slot
  selectSlot(slot: any, period: string): void {
    // Reset all slots' selection
    this.slots.forEach((session: any) => {
      ['morning', 'afternoon', 'evening'].forEach((timeOfDay) => {
        session[timeOfDay]?.slots.forEach((s: any) => {
          s.is_selected = false;
        });
      });
    });
  
    // Set the selected state for the clicked slot
    slot.is_selected = true;
  
    // Update the selectedSlot property with additional period information
    this.selectedSlot = {
      ...slot,
      period: period, // Add the period to the selectedSlot object
    };
  
    console.log(this.selectedSlot);
  }

  // Method to open the modal for adding a new doctor
  
  feedbackMessage: string | null = null;
isFeedbackSuccess: boolean = true;

bookAppointment(): void {
  if (this.selectedSlot) {
    const period = this.selectedSlot.period; // Use the period directly from selectedSlot

    // Mark the selected slot as occupied and selected
    this.selectedSlot.is_occupied = true;
    this.selectedSlot.is_selected = true;

    // Update the slot on the server
    this.slotService.updateSlot(period, this.selectedSlot.time, this.selectedSlot).subscribe({
      next: (updatedSlot: any) => {
        console.log('Slot booked successfully!', updatedSlot);

        // Provide success feedback
        this.feedbackMessage = `Appointment for ${this.selectedDoctor.name}, ${this.selectedSlot.time}, has been created successfully!`;
        this.isFeedbackSuccess = true;

        // Clear feedback after a delay
        setTimeout(() => (this.feedbackMessage = null), 3000);

        // Reset selected slot after booking
        this.selectedSlot.is_selected = false;
        
        setTimeout(() => {
          location.reload(); 
        }, 3500); 
        console.log(this.selectedSlot);
      },
      error: (err) => {
        console.error('Error booking appointment:', err);

        // Provide error feedback
        this.feedbackMessage = 'An error occurred while booking the slot. Please try again.';
        this.isFeedbackSuccess = false;

        // Clear feedback after a delay
        setTimeout(() => (this.feedbackMessage = null), 3000);
      },
    });
  } else {
    // Handle case where no slot is selected
    this.feedbackMessage = 'Please select a slot first!';
    this.isFeedbackSuccess = false;

    // Clear feedback after a delay
    setTimeout(() => (this.feedbackMessage = null), 3000);
  }
}


  isModalOpen = false;  // Controls the visibility of the modal
  newDoctor = {  // Holds the data for the new doctor
    name: '',
    qualification: '',
    description: '',
    image_url: ''
  };

  // Method to open the modal
  openModal(): void {
    this.isModalOpen = true;
  }

  // Method to close the modal
  closeModal(): void {
    this.isModalOpen = false;
    this.newDoctor = { name: '', qualification: '', description: '', image_url: '' }; // Reset the form
  }

  // Method to add a new doctor
  addDoctor(): void {
    if (this.newDoctor.name && this.newDoctor.qualification) {
      // Call the service to add the new doctor
      this.doctorService.addDoctor(this.newDoctor).subscribe(updatedDoctors => {
        this.doctors = updatedDoctors; // Update the doctors list
        this.closeModal(); // Close the modal after adding the doctor
      });
    } else {
      alert('Please fill in all required fields!');
    }
  }

  // Method to delete a doctor
  deleteDoctor(doctorId: string) {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.doctorService.deleteDoctor(doctorId).subscribe(() => {
        // After deletion, reload the doctor list
        this.getDoctors();
      });
    }
  }

  // Method to fetch the updated doctors list
  getDoctors() {
    this.doctorService.getDoctors().subscribe({
      next: (data: any) => {
        this.doctors = data;
      },
      error: (err) => {
        console.error('Error fetching doctors:', err);
      }
    });
  }
}
