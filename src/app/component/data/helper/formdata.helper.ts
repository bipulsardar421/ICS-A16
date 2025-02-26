import { FormGroup } from '@angular/forms';

export class FormDataConverter {
  static toFormData(formGroup: FormGroup): FormData {
    const formData = new FormData();
    
    Object.keys(formGroup.controls).forEach(key => {
      const value = formGroup.get(key)?.value;
      if (value instanceof File) {
        formData.append(key, value, value.name);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    return formData;
  }
}
