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
import { AdminProductCreateDto } from '../../../../shared/models/admin/product/AdminProductCreateDto';
import { AlertService } from '../../../../shared/services/alert-service';
import { AdminCategoryDto } from '../../../../shared/models/admin/product/AdminProductCategoryDto';

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

  // Bisogna separare tutte le categorie da quelle SUB categorie e PARENT
  allCategories: AdminCategoryDto[] = [];
  parentCategories: AdminCategoryDto[] = [];
  subCategories: AdminCategoryDto[] = [];
  filteredSubCategories: AdminCategoryDto[] = [];

  models: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private http: AdminProductHttp, private alert: AlertService) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadReferenceData();
  }

  onParentCategoryChange() {
    const parentId = this.form.get('parentCategoryId')?.value;

    if (!parentId) {
      this.filteredSubCategories = [];
      this.form.get('productCategoryId')?.reset();
      this.form.get('productCategoryId')?.disable();
      return;
    }

    this.filteredSubCategories = this.subCategories.filter(
      c => c.parentProductCategoryId === parentId
    );

    this.form.get('productCategoryId')?.enable();
    this.form.get('productCategoryId')?.reset();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      // General
      parentCategoryId: [{ value: null, disabled: false }, Validators.required],
      productCategoryId: [{ value: null, disabled: true }, Validators.required],
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
    this.http.getCategories().subscribe(categories => {
      this.allCategories = categories;

      // categorie padri
      this.parentCategories = categories.filter(c => c.parentProductCategoryId === null);
      // solo le SUB categorie
      this.subCategories = categories.filter(c => c.parentProductCategoryId !== null);
    });

    this.http.getModels().subscribe({
      next: (models) => (this.models = models),
      error: (err) => console.error('Failed to load models', err),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto: AdminProductCreateDto = {
      ...this.form.value,
      sellStartDate: this.toIso(this.form.value.sellStartDate),
      sellEndDate: this.toIso(this.form.value.sellEndDate),
      discontinuedDate: this.toIso(this.form.value.discontinuedDate),
    }

    this.http.createProduct(dto).subscribe({
      next: (productId) => {
        console.log('Created product with id', productId);
        this.alert.showAlert('Product created successfully', 'success');
        this.router.navigate(['/admin/products']);
      },
      error: err => console.error('Create failed', err)
    });

    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate(['/admin/products']);
    }, 800);
  }

  cancel(): void {
    this.router.navigate(['/admin/products']);
  }

  // helper
  private toIso(date: string | null): string | null {
    return date ? new Date(date).toISOString() : null;
  }
}
