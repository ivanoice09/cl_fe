import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-form',
  imports: [],
  templateUrl: './edit-form.html',
  styleUrl: './edit-form.css',
})
export class EditForm {

  // Inizializzo l'oggetto form
  form!: FormGroup;

  // Disabilita dei campi quando il prodotto è già stato ordinato
  hasOrders = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group(
      {
        // General
        productCategoryId: [null, Validators.required],
        productModelId: [null],
        productNumber: ['', Validators.required],
        name: ['', Validators.required],

        // Pricing
        listPrice: [0, [Validators.required, Validators.min(0)]],
        standardCost: [0, [Validators.required, Validators.min(0)]],

        // Attributes
        color: [''],
        size: [''],
        weight: [null, Validators.min(0)],

        // Availability
        sellStartDate: [null, Validators.required],
        sellEndDate: [null],
        discontinuedDate: [null],
      }
    );
  }

}
