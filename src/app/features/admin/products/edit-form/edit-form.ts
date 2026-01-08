import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminProductUpdateDto } from '../../../../shared/models/admin/product/AdminProductUpdateDto';
import { AdminProductEditDto } from '../../../../shared/models/admin/product/AdminProductEditDto';
import { AlertService } from '../../../../shared/services/alert-service';
import { AdminProductHttp } from '../../../../shared/services/admin/admin-product-http';
import { AdminCategoryDto } from '../../../../shared/models/admin/product/AdminProductCategoryDto';
import { AdminProductModelDto } from '../../../../shared/models/admin/product/AdminProductModelDto';

@Component({
  selector: 'app-edit-form',
  standalone: true,
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './edit-form.html',
  styleUrl: './edit-form.css',
})
export class EditForm {
  // Variables
  form!: FormGroup;

  // isEditMode = false;
  hasOrders = false;

  // raw
  categories: AdminCategoryDto[] = [];
  models: AdminProductModelDto[] = [];

  // derived (UI-only)
  parentCategories: AdminCategoryDto[] = [];
  subCategories: AdminCategoryDto[] = [];
  filteredSubCategories: AdminCategoryDto[] = [];

  productCategoryId: number | null = null;

  isSubmitting = false;

  private originalProduct!: AdminProductFormSnapshot;

  confirmationChanges: ChangeItem[] = [];
  pendingUpdate!: AdminProductUpdateDto;

  isConfirmModalOpen = false;

  private currentProductId: number | null = null;

  // Constructor
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private alertService: AlertService,
    private adminProductHttp: AdminProductHttp,
    private router: Router,
  ) { }

  //-----------
  // functions:
  //-----------

  ngOnInit(): void {
    this.buildForm();

    const data = this.route.snapshot.data['data'];

    // reference data
    this.categories = data.categories;
    this.models = data.models;

    this.initCategoryHierarchy();

    this.setupCategoryAutoSync();

    // edit mode
    if (data.product) {
      this.enterEditMode(data.product);
      this.patchCategoryForEdit(data.product.productCategoryId);
    }
  }

  onUpdateClick() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const updatedSnapshot = this.getFormSnapshot();
    const changes = this.computeChanges(this.originalProduct, updatedSnapshot);

    if (changes.length === 0) {
      this.alertService.showAlert('No changes detected');
      return;
    }

    const dto = this.buildUpdateDtoFromSnapshot(updatedSnapshot);
    this.openConfirmationModal(changes, dto);
  }

  openConfirmationModal(changes: ChangeItem[], dto: AdminProductUpdateDto) {
    this.confirmationChanges = changes;
    this.pendingUpdate = dto;
    this.isConfirmModalOpen = true;
  }

  confirmUpdate() {
    this.adminProductHttp.updateProduct(this.pendingUpdate).subscribe({
      next: () => {
        this.isConfirmModalOpen = false;
        this.router.navigate(['/admin/products']);
        this.alertService.showAlert('Successfully Updated', 'success');
      },
      error: (err) => {
        console.error(err);
      },
    });
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


  //-----------------
  // Private methods:
  //-----------------

  private buildForm() {
    this.form = this.fb.group(
      {
        // General
        parentCategoryId: [{ value: null, disabled: false }, Validators.required],
        productCategoryId: [{ value: null, disabled: false }, Validators.required],
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
      },
      {
        validators: [priceConsistencyValidator, dateConsistencyValidator],
      }
    );
  }

  private enterEditMode(product: AdminProductEditDto & any) {
    // this.isEditMode = true;
    this.hasOrders = product.hasOrders;
    this.currentProductId = product.productId; // IMPORTANT

    const snapshot = this.mapEditDtoToSnapshot(product);

    this.originalProduct = structuredClone(snapshot);

    this.form.patchValue(snapshot);

    if (this.hasOrders) {
      this.form.get('productNumber')?.disable();
    }
  }

  private mapEditDtoToSnapshot(product: AdminProductEditDto & any): AdminProductFormSnapshot {
    return {
      parentCategoryId: product.parentCategoryId,
      productCategoryId: product.productCategoryId,
      productModelId: product.productModelId,
      productNumber: product.productNumber,
      name: product.name,

      listPrice: product.listPrice,
      standardCost: product.standardCost,

      color: product.color,
      size: product.size,
      weight: product.weight,

      sellStartDate: this.toDateInput(product.sellStartDate),
      sellEndDate: this.toDateInput(product.sellEndDate),
      discontinuedDate: this.toDateInput(product.discontinuedDate),
    };
  }

  private getFormSnapshot(): AdminProductFormSnapshot {
    const raw = this.form.getRawValue();

    return {
      parentCategoryId: raw.parentCategoryId,
      productCategoryId: raw.productCategoryId,
      productModelId: raw.productModelId,
      productNumber: raw.productNumber,
      name: raw.name,

      listPrice: raw.listPrice,
      standardCost: raw.standardCost,

      color: raw.color,
      size: raw.size,
      weight: raw.weight,

      sellStartDate: raw.sellStartDate,
      sellEndDate: raw.sellEndDate,
      discontinuedDate: raw.discontinuedDate,
    };
  }

  private buildUpdateDtoFromSnapshot(s: AdminProductFormSnapshot): AdminProductUpdateDto {
    if (this.currentProductId == null) {
      throw new Error('Missing productId (not in edit mode?)');
    }

    return {
      productId: this.currentProductId,

      productCategoryId: s.productCategoryId!, // if required by backend
      productModelId: s.productModelId!, // if required by backend
      name: s.name,
      productNumber: s.productNumber,

      standardCost: s.standardCost,
      listPrice: s.listPrice,

      color: s.color || undefined,
      size: s.size || undefined,
      weight: s.weight ?? undefined,

      sellStartDate: s.sellStartDate!, // required by validator
      sellEndDate: s.sellEndDate || undefined,
      discontinuedDate: s.discontinuedDate || undefined,
    };
  }

  private setupCategoryAutoSync() {
    this.form.get('productCategoryId')?.valueChanges.subscribe((productCategoryId) => {
      const category = this.categories.find((c) => c.productCategoryId === productCategoryId);

      this.productCategoryId = category?.parentProductCategoryId ?? null;
    });
  }

  private toDateInput(date: string | null): string | null {
    if (!date) return null;
    return date.split('T')[0];
  }

  // Helper functions:
  /**
   * to make the update preview from 5 -> 6
   * to Mountain Bikes -> Road Bikes
   * @param id 
   * @returns the product category stringified through mapping of id's
   */
  getProductCategoryName(id: number | null): string {
    if (id == null) return '-';
    return this.categories.find(c => c.productCategoryId === id)?.name ?? 'Unknown';
  }

  getProductModelName(id: number | null): string {
    if (id == null) return '-';
    return this.models.find(m => m.productModelId === id)?.name ?? 'Unknown';
  }

  private computeChanges(
    original: AdminProductFormSnapshot,
    updated: AdminProductFormSnapshot
  ): ChangeItem[] {
    const changes: ChangeItem[] = [];

    const addIfChanged = (
      key: keyof AdminProductFormSnapshot,
      label: string,
      formatter?: (value: any) => string
    ) => {
      const before = original[key];
      const after = updated[key];

      if (before !== after) {
        changes.push({
          label,
          before: formatter ? formatter(before) : String(before ?? '—'),
          after: formatter ? formatter(after) : String(after ?? '—'),
        });
      }
    };

    addIfChanged('name', 'Name');
    addIfChanged('productNumber', 'Product number');
    addIfChanged('parentCategoryId', 'Parent category', (id) => this.getProductCategoryName(id));
    addIfChanged('productCategoryId', 'Sub category', (id) => this.getProductCategoryName(id));
    addIfChanged('productModelId', 'Model', (id) => this.getProductModelName(id));
    addIfChanged('standardCost', 'Standard cost');
    addIfChanged('listPrice', 'List price');
    addIfChanged('color', 'Color');
    addIfChanged('size', 'Size');
    addIfChanged('weight', 'Weight');
    addIfChanged('sellStartDate', 'Sell start date');
    addIfChanged('sellEndDate', 'Sell end date');
    addIfChanged('discontinuedDate', 'Discontinued date');

    return changes;
  }

  private initCategoryHierarchy() {
    this.parentCategories = this.categories.filter(
      c => c.parentProductCategoryId === null
    );

    this.subCategories = this.categories.filter(
      c => c.parentProductCategoryId !== null
    );
  }

  private patchCategoryForEdit(subCategoryId: number) {
    const sub = this.subCategories.find(
      c => c.productCategoryId === subCategoryId
    );
    if (!sub) return;

    const parentId = sub.parentProductCategoryId;

    this.form.patchValue({
      parentCategoryId: parentId,
    });

    this.onParentCategoryChange();

    this.form.patchValue({
      productCategoryId: subCategoryId,
    });
  }
} // Outside the class

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

interface ChangeItem {
  label: string;
  before: string;
  after: string;
}
