import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  ɵInternalFormsSharedModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AdminProductHttp } from '../../../../shared/services/admin/admin-product-http';

@Component({
  selector: 'app-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ɵInternalFormsSharedModule],
  templateUrl: './create-form.html',
  styleUrl: './create-form.css',
})
export class CreateForm {
  form!: FormGroup;
  isSubmitting = false;

  categories: any[] = [];
  models: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private http: AdminProductHttp) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadReferenceData();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      // General
      productCategoryId: [null, Validators.required],
      productModelId: [null],
      productNumber: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(100)]],

      // Pricing
      listPrice: [0, [Validators.required, Validators.min(0)]],
      standardCost: [0, [Validators.required, Validators.min(0)]],

      // Attributes
      color: [''],
      size: [''],
      weight: [null],

      // Availability
      sellStartDate: [null, Validators.required],
      sellEndDate: [null],
      discontinuedDate: [null],
    });
  }

  private loadReferenceData(): void {
    this.http.getCategories().subscribe({
      next: (categories) => (this.categories = categories),
      error: (err) => console.error('Failed to load categories', err),
    });

    this.http.getModels().subscribe({
      next: (models) => (this.models = models),
      error: (err) => console.error('Failed to load models', err),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = this.form.value;

    // TODO: call ProductService.create(payload)
    console.log('Creating product:', payload);

    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate(['/admin/products']);
    }, 800);
  }

  cancel(): void {
    this.router.navigate(['/admin/products']);
  }
}
