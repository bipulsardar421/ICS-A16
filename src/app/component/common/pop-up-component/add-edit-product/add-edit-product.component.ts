
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
  DestroyRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../data/services/alert.service';
import { ModalService, ModalType } from '../../../data/services/modal.service';
import { CommonModule } from '@angular/common';
import { StockService } from '../../../data/services/stock/stock.service';
import { FormDataConverter } from '../../../data/helper/formdata.helper';
import { StockInterface } from '../../../data/interfaces/stock.interface';
import { AuthService } from '../../../data/services/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ClientVendorService } from '../../../data/services/client-vendor/client-vendor.service';

@Component({
  selector: 'app-add-edit-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-product.component.html',
  styleUrl: './add-edit-product.component.css',
})
export class AddEditProductComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  private stockService = inject(StockService);
  private alertService = inject(AlertService);

  invalidImageFormat = false;
  userRole$ = this.authService.userRole$;
  productForm!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  what = 'Add';
  vendorsList: { id: string; name: string }[] = [];
  currentProduct: StockInterface | null = null;
  isSubmitting = false;
  private modalRef: any;

  @ViewChild('add_product') add_productModalContent!: TemplateRef<any>;

  constructor(private _vendor: ClientVendorService) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.userRole$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((role) => {
        if (role === 'vendor') {
          this.productForm.patchValue({
            vendors: localStorage.getItem('user_id'),
          });
        }
      });

    this.modalService.openModalEvent
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((modalType) => {
        if (modalType === ModalType.PRODUCT) {
          this.openModal();
        }
      });

    this.modalService.dataTransferObject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        if (data) {
          this.what = data.type;
          if (data.type === 'Edit' && data.product) {
            this.currentProduct = data.product;
            this.ifEditSetForm(data.product);
          } else {
            this.currentProduct = null;
            this.resetForm();
          }
        }
      });

    this.loadVendors();
  }

  private buildForm() {
    this.productForm = this.fb.group({
      product_id: [0],
      product_name: ['', [Validators.required, Validators.maxLength(255)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      rate: [0, [Validators.required, Validators.min(1)]],
      vendors: ['', Validators.required],
      recieved_date: ['', Validators.required],
      image: [null],
    });
  }

  private resetForm() {
    this.productForm.reset({
      product_id: 0,
      quantity: 1,
      rate: 0,
      product_name: '',
      vendors: '',
      recieved_date: '',
      image: null,
    });
    this.selectedFile = null;
    this.invalidImageFormat = false;
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl); 
    }
    this.previewUrl = null; 
  }

  private loadVendors() {
    this._vendor.getAllVendors().subscribe({
      next: (response) => {
        this.vendorsList = response.data.map((vendor: any) => ({
          id: vendor.vendor_id.toString(),
          name: vendor.vendor_name,
        }));
      },
      error: (err) => {
        console.error('Error fetching vendors:', err);
        this.vendorsList = [];
      },
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const allowedTypes = ['image/jpeg', 'image/png'];

      if (!allowedTypes.includes(file.type)) {
        this.invalidImageFormat = true;
        this.productForm.get('image')?.setErrors({ invalidFormat: true });
        this.previewUrl = null;
      } else {
        this.invalidImageFormat = false;
        this.selectedFile = file;
        this.productForm.patchValue({ image: this.selectedFile });
        if (this.previewUrl) {
          URL.revokeObjectURL(this.previewUrl);
        }
        this.previewUrl = URL.createObjectURL(file);
      }
    }
  }

  ifEditSetForm(product: StockInterface) {
    
    this.productForm.patchValue({
      product_id: product.product_id,
      product_name: product.product_name,
      quantity: product.quantity,
      rate: product.rate,
      vendors: product.vendor_id.toString(),
      recieved_date: product.recieved_date.split('T')[0],
      image: product.image,
    });
    this.selectedFile = null;
    this.previewUrl = null;
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      alert('Please fill all required fields correctly.');
      return;
    }

    this.isSubmitting = true;
    const formData = FormDataConverter.toFormData(this.productForm);

    if (this.selectedFile) {
      formData.set('image', this.selectedFile);
    } else if (this.what === 'Edit' && this.currentProduct?.image) {
      formData.set('image', this.currentProduct.image);
    }

    

    this.alertService.showLoading();

    const request =
      this.what === 'Edit' && this.currentProduct
        ? this.stockService.updateStock(
            this.currentProduct.product_id,
            formData
          )
        : this.stockService.addStock(formData);

    request
      .pipe(
        catchError((err) => {
          this.alertService.hideLoading();
          this.alertService.showAlert(
            'danger',
            err.message || 'Operation failed'
          );
          this.isSubmitting = false;
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((response) => {
        if (response) {
          this.alertService.hideLoading();
          this.alertService.showAlert(
            'success',
            response.message || `${this.what} successful`
          );
          this.stockService.notifyStockUpdate();
          this.closeModal();
        }
        this.isSubmitting = false;
      });
  }

  openModal() {
    if (this.add_productModalContent) {
      this.modalRef = this.ngbModalService.open(this.add_productModalContent, {
        ariaLabelledBy: 'modal-basic-title',
        backdrop: 'static',
        keyboard: false,
      });
    }
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
    this.resetForm();
    this.previewUrl = null;
    this.modalService.clearCurrentData();
  }
}
