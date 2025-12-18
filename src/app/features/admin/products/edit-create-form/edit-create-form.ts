import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-create-form',
  standalone: true,
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, CommonModule, RouterModule],
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
      this.isEditMode = true;
      this.hasOrders = data.product.hasOrders;

      this.form.patchValue({
        name: data.product.name,
        productNumber: data.product.productNumber,
        categoryId: data.product.categoryId,
        productModelId: data.product.productModelId,

        listPrice: data.product.listPrice,
        standardCost: data.product.standardCost,

        color: data.product.color,
        size: data.product.size,
        weight: data.product.weight,

        sellStartDate: data.product.sellStartDate,
        sellEndDate: data.product.sellEndDate,
        discontinuedDate: data.product.discontinuedDate
      });

      if (this.hasOrders) {
        this.form.get('productNumber')?.disable();
      }
    }
  }

  private buildForm() {
    this.form = this.fb.group({

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
    });
  }

  submit() {
    if (this.form.invalid) return;

    const payload = {
      ...this.form.getRawValue(),
      parentCategoryId: this.productCategoryId
    };

    if (this.isEditMode) {

    } else {

    }
  }

  private setupCategoryAutoSync() {
    this.form.get('categoryId')?.valueChanges.subscribe(categoryId => {
      const category = this.categories.find(
        c => c.productCategoryId === categoryId
      );

      this.productCategoryId = category?.parentProductCategoryId ?? null;
    })
  }

}
