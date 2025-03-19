import {
  Component,
  inject,
  TemplateRef,
  ViewChild,
  OnDestroy,
  DestroyRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ModalService, ModalType } from '../../../data/services/modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormDataConverter } from '../../../data/helper/formdata.helper';
import { SignUpService } from '../../../data/services/sign-up/sign-up.service';
import { AlertService } from '../../../data/services/alert.service';

@Component({
  selector: 'app-add-edit-vendor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './add-edit-vendor.component.html',
  styleUrl: './add-edit-vendor.component.css',
})
export class AddEditVendorComponent implements OnDestroy {
  @ViewChild('addEditVendor') addEditVendor!: TemplateRef<any>;
  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);
  private destroyRef = inject(DestroyRef);
  imagePreview: string | ArrayBuffer | null = null;
  imageError: string | null = null;

  userForm: FormGroup;
  what: string = 'Add';

  constructor(
    private fb: FormBuilder,
    private _signUp: SignUpService,
    private _alert: AlertService
  ) {
    this.userForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required],
        name: ['', [Validators.required, Validators.minLength(3)]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        address: ['', [Validators.required, Validators.minLength(10)]],
        image: [null, Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.modalService.openModalEvent
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((modalType) => {
        if (modalType === ModalType.VENDOR) {
          this.openModal();
        }
      });

    this.modalService.dataTransferObject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        if (data) {
          // this.what = data.type;
        }
      });
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.imageError = 'Only JPG, JPEG, or PNG files are allowed!';
        this.userForm.patchValue({ image: null });
        return;
      }
      this.imageError = null;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
      this.userForm.patchValue({ image: file });
    }
  }
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this._alert.showLoading();
      const form = FormDataConverter.toFormData(this.userForm);
      this._signUp.registerUser(form).subscribe({
        next: (res) => {
          this._alert.hideLoading();
          if (res.status === "success") {
            this._alert.showAlert("success", res.message);
            this.userForm.reset();
            this.ngbModalService.dismissAll();
          }else{
            this._alert.showAlert("danger", res.message);
          }
        },
      });
    }
  }

  openModal() {
    if (this.addEditVendor) {
      this.ngbModalService.open(this.addEditVendor, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
      });
    }
  }

  ngOnDestroy(): void {}
}
