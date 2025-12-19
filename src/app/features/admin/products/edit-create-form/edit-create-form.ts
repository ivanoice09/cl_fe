import { Component } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ɵInternalFormsSharedModule, 
  ReactiveFormsModule, 
  ValidatorFn, 
  AbstractControl, 
  ValidationErrors 
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-create-form',
  standalone: true,
  imports: [
    ɵInternalFormsSharedModule, 
    ReactiveFormsModule, 
    CommonModule, 
    RouterModule
  ],
  templateUrl: './edit-create-form.html',
  styleUrl: './edit-create-form.css',
})
export class EditCreateForm {

  form!: FormGroup;

  isEditMode = false;
  hasOrders = false;

  categories: any[] = [];
  models: any[] = [];

  productCategoryId: number | null = null;

  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.buildForm();

    const data = this.route.snapshot.data['data'];

    // reference data
    this.categories = data.categories;
    this.models = data.models;

    this.setupCategoryAutoSync();

    // edit mode
    if (data.product) {
      this.enterEditMode(data.product);
    }
  }

  submit() {

    // Prevent double submitting
    if (this.isSubmitting) return;

    // Gaurd: block invalid form (includes custom validators)
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.form.getRawValue(),
      parentCategoryId: this.productCategoryId
    };

    if (this.isEditMode) {

    } else {

    }
  }

  private enterEditMode(product: any) {
    this.isEditMode = true;
    this.hasOrders = product.hasOrders;

    this.form.patchValue({

      // General
      name: product.name,
      productNumber: product.productNumber,
      categoryId: product.categoryId,
      productModelId: product.productModelId,

      // Pricing
      listPrice: product.listPrice,
      standardCost: product.standardCost,

      // Attributes
      color: product.color,
      size: product.size,
      weight: product.weight,

      // Availability
      sellStartDate: this.toDateInput(product.sellStartDate),
      sellEndDate: this.toDateInput(product.sellEndDate),
      discontinuedDate: this.toDateInput(product.discontinuedDate)
    });

    if (this.hasOrders) {
      this.form.get('productNumber')?.disable();
    }
  }

  private buildForm() {
    this.form = this.fb.group(
      {

      // General
      name: ['', Validators.required],
      productNumber: ['', Validators.required],
      categoryId: [null, Validators.required],
      productModelId: [null],

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

      },
      {
        validators: [
          priceConsistencyValidator,
          dateConsistencyValidator
        ]
      }
    );
  }

  private setupCategoryAutoSync() {
    this.form.get('categoryId')?.valueChanges.subscribe(categoryId => {
      const category = this.categories.find(
        c => c.productCategoryId === categoryId
      );

      this.productCategoryId = category?.parentProductCategoryId ?? null;
    })
  }

  private toDateInput(date: string | null): string | null {
    if (!date) return null;
    return date.split('T')[0];
  }

}

// Custom validators
export const priceConsistencyValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const listPrice = control.get('listPrice')?.value;
  const standardCost = control.get('standardCost')?.value;

  if (listPrice != null && standardCost != null && listPrice < standardCost) {
    return { priceMismatch: true };
  }

  return null;
};

export const dateConsistencyValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const start = control.get('sellStartDate')?.value;
  const end = control.get('sellEndDate')?.value;
  const discontinued = control.get('discontinuedDate')?.value;

  if (start && end && end < start) {
    return { sellEndBeforeStart: true };
  }

  if (start && discontinued && discontinued < start) {
    return { discontinuedBeforeStart: true };
  }

  return null;
};