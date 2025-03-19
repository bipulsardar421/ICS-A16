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
import { SignUpService } from '../../../data/services/sign-up/sign-up.service';
import { CommonModule } from '@angular/common';
import { StockService } from '../../../data/services/stock/stock.service';
import { FormDataConverter } from '../../../data/helper/formdata.helper';
import { Router } from '@angular/router';
import { StockInterface } from '../../../data/interfaces/stock.interface';
import { UserService } from '../../../data/services/user-details/user.service';
import { AuthService } from '../../../data/services/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';

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
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private stockService = inject(StockService);
  private alertService = inject(AlertService);
  private userService = inject(UserService);
  invalidImageFormat = false;
  userRole$ = this.authService.userRole$;
  productForm!: FormGroup;
  selectedFile: File | null = null;
  what = 'Add';
  image = true;
  product: any;
  vendorsList: { id: number; name: string }[] = [];

  @ViewChild('add_product') add_productModalContent!: TemplateRef<any>;

  constructor() {
    this.buildForm();
  }

  ngOnInit(): void {
    this.userRole$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((role) => {
      if (role === 'vendor') {
        this.productForm.patchValue({ vendors: localStorage.getItem('user_id') });
      }
    });

    this.modalService.openModalEvent.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((modalType) => {
      if (modalType === ModalType.PRODUCT) {
        this.openModal();
      }
    });

    this.modalService.dataTransferObject.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      if (data) {
        this.what = data.type;
        if (data.type === 'Edit') {
          this.ifEditSetForm(data.product);
        }
      }
    });

    this.loadVendors();
  }

  private buildForm() {
    this.productForm = this.fb.group({
      product_name: ['', [Validators.required, Validators.maxLength(255)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      rate: [0, [Validators.required, Validators.min(1)]],
      vendors: ['', Validators.required],
      recieved_date: ['', Validators.required],
      image: [null, Validators.required],
    });
  }

  private loadVendors() {
    this.userService
      .getDetails()
      .pipe(
        map((res) => res.map((data: any) => ({ id: data.user_id, name: data.user_name }))),
        catchError((err) => {
          console.error('Error fetching vendors:', err);
          return of([]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((vendors) => (this.vendorsList = vendors));
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const allowedTypes = ['image/jpeg', 'image/png'];

      if (!allowedTypes.includes(file.type)) {
        this.invalidImageFormat = true;
        this.productForm.get('image')?.setErrors({ invalidFormat: true });
      } else {
        this.invalidImageFormat = false;
        this.selectedFile = file;
        this.productForm.patchValue({ image: this.selectedFile });
      }
    }
  }

  ifEditSetForm(product: StockInterface) {
    console.log(product);
  }

  onSubmit() {
    if (this.productForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const formData = FormDataConverter.toFormData(this.productForm);
    this.alertService.showLoading();

    this.stockService.addStock(formData).pipe(
      catchError((err) => {
        this.alertService.hideLoading();
        this.alertService.showAlert('danger', err.message);
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((response) => {
      if (response) {
        this.alertService.hideLoading();
        this.alertService.showAlert('success', response.message);
        this.stockService.notifyStockUpdate();
        this.closeModal();
      }
    });
  }

  openModal() {
    if (this.add_productModalContent) {
      this.ngbModalService.open(this.add_productModalContent, { ariaLabelledBy: 'modal-basic-title' });
    }
  }

  closeModal() {
    if (this.add_productModalContent) {
      this.ngbModalService.dismissAll();
    }
  }
}
