import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatSliderModule} from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatSliderModule, FormsModule, 
    MatFormFieldModule, MatInputModule,MatSlideToggleModule, MatCheckboxModule, MatSelectModule, 
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements OnInit{
  title = 'IDFormat';
  sidFields = [
    {
      "id": "1",
      "type": "CC",
      "code": "CC",
      "name": "Country Code",
      "order": "4",
      "value": "aus",
      "description": "AUS is a sample value.It will get country code according to student country of birth",
      "digit": "",
      "status": "1",
      "maxlength": "4"
    },
    {
      "id": "2",
      "type": "UN",
      "code": "UN",
      "name": "University Name",
      "order": "2",
      "value": "Mel",
      "description": "Max 5 Characters, Text in Student ID",
      "digit": "",
      "status": "1",
      "maxlength": "5"
    },
    {
      "id": "3",
      "type": "YR",
      "code": "YR",
      "name": "Year Digit",
      "order": "3",
      "value": "4",
      "description": "Current year digit characters, 2:for last two year digits, 4:for full year digits ",
      "digit": "2",
      "status": "1",
      "maxlength": "4"
    },
    {
      "id": "4",
      "type": "AN",
      "code": "AN",
      "name": "Auto Number",
      "order": "1",
      "value": "UUMX4FCS",
      "description": "Max 6 digits position. This value will be the number of random digits. Where D is the random number.",
      "digit": "2",
      "status": "1",
      "maxlength": "6"
    },
  ];
  formatTypes: any = []
  allFormatTypes : any = []
  selectAll = true;
  useRandomNumber = false;
  orderSets = [1,2,3,4];
  previewId = '';
  ngOnInit(): void {
    this.getFormatTypes()
    this.getAllFormatTypes()
    console.log("formatTypes: ", JSON.stringify(this.formatTypes))
  }


  toggleAllCheckboxes() {
    this.formatTypes.forEach((type) => {
      type.isSelected = this.selectAll;
    });
  }
 
  getFormatTypes(){
    this.formatTypes = this.sidFields.map(x => {
      return { id: x.id, name: x.name, isSelected: true, selectedFormat: null}
    })
  }
  getAllFormatTypes(){
    this.allFormatTypes = this.sidFields.map(x => {
      return { id: x.id, name: x.name}
    })
  }

  getAvailableOrderSets(currentSelectedOrderSet: number) {
    // Get all selected order sets
    const selectedOrderSets = this.formatTypes
      .filter(type => type.selectedOrderSet !== null && type.selectedOrderSet !== currentSelectedOrderSet)
      .map(type => type.selectedOrderSet);

    // Filter out selected values from available order sets
    return this.orderSets.filter(orderSet => !selectedOrderSets.includes(orderSet));
  }

  // Method to get the available format types, excluding the ones that are already selected
  getAvailableFormats(currentSelectedFormat) {
    let selectedFormats = this.formatTypes
      .filter((type) => type.selectedFormat !== null && type.selectedFormat !== currentSelectedFormat)
      .map((type) => type.selectedFormat);

    // Exclude 'Auto Number' when useRandomNumber is true
    let availableFormats = this.allFormatTypes.filter(
      (format) => !selectedFormats.includes(format.id)
    );

    if (this.useRandomNumber) {
      // Remove "Auto Number" if the toggle is on
      availableFormats = availableFormats.filter(format => format.name !== 'Auto Number');
    }

    return availableFormats;
  }

  // Method to handle when a format is selected
  // onSelectFormat(selectedFormatId: string) {
  //   // You can add any additional logic if needed
  // }

  // Method to handle mat-slide-toggle change
  onToggleRandomNumber() {
    // This will refresh the dropdowns when the toggle is switched
    this.formatTypes.forEach(type => {
      if (type.selectedFormat === '4' && this.useRandomNumber) {
        type.selectedFormat = null; // Reset if 'Auto Number' was previously selected
      }
    });
  }
  

  // Get available formats (filter logic can be applied here)
  // getAvailableFormats(selectedFormat: any) {
  //   return this.formatTypes;
  // }

  // Get available order sets (filter logic can be applied here)
  // getAvailableOrderSets(selectedOrderSet: any) {
  //   return this.orderSets;
  // }

  // Handle selection change for Format Type
  // onSelectFormat(type: any, index: number) {
  //   if (type.selectedFormat === '4') { // Auto Number
  //     this.generateAutoNumber(type);
  //   }
  // }

  // Handle length change for auto number generation or value trimming
  onLengthChange(type: any, index: number) {
    if (type.selectedFormat === '4') { // Auto Number
      this.generateAutoNumber(type);
    } else if (type.selectedFormat === '3') { // Year Digit
      this.captureYearDigits(type); // Capture last N digits of year
    } else {
      // Trim the value based on length for other formats
      if (type.value) {
        type.value = type.value.substring(0, type.length);
      }
    }
  }
// Capture the last N digits of the year based on length
captureYearDigits(type: any) {
  if (type.length && type.value) {
    const yearString = type.value.toString();
    const start = yearString.length - type.length;
    type.value = yearString.substring(start < 0 ? 0 : start); // Capture last N digits
  }
}
  // Handle value input change
  onValueChange(type: any, index: number) {
    if (type.selectedFormat === '3') { // Year Digit
      this.captureYearDigits(type);
    } else if (type.selectedFormat !== '4') { // Non-auto formats
      type.value = type.value.substring(0, type.length); // Restrict value by length
    }
  }

  // Check if format is Auto Number
  isAutoNumber(selectedFormat: any): boolean {
    return selectedFormat === '4';
  }

  // Generate auto number based on length
  generateAutoNumber(type: any) {
    if (type.length) {
      type.value = Array.from({ length: type.length }, () => Math.floor(Math.random() * 10)).join('');
    }
  }

  // Concatenate values based on the order set and generate the preview
  generatePreview() {
    const orderedFormats = this.formatTypes
      .filter(type => type.isSelected && type.selectedOrderSet !== null)
      .sort((a, b) => a.selectedOrderSet - b.selectedOrderSet);

    this.previewId = orderedFormats.map(type => type.value).join('');
  }
}
