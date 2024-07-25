import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Multiplier } from '../model/Multiplier';
import { MultipliersService } from '../services/multipliers.service';

@Component({
  selector: 'fr-add-multiplier-form',
  templateUrl: './add-multiplier.component.html',
  styleUrls: ['./add-multiplier.component.css']
})
export class AddMultiplierComponent {

  @Input() show: boolean = false;
  form: FormGroup;
  @Output() close = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private multipliersService: MultipliersService
  ) {
    this.form = this.fb.group({
      defaultAdditionsMultiplier: ['', [Validators.required, Validators.min(0)]],
      defaultDeletionsMultiplier: ['', [Validators.required, Validators.min(0)]],
      fileMultipliers: this.fb.array([])
    });
  }

  get fileMultipliers(): FormArray {
    return this.form.get('fileMultipliers') as FormArray;
  }

  addFileMultiplier(): void {
    this.fileMultipliers.push(this.fb.group({
      fileExtension: ['', Validators.required],
      additionsMultiplier: ['', [Validators.required, Validators.min(0)]],
      deletionsMultiplier: ['', [Validators.required, Validators.min(0)]]
    }));
  }

  removeFileMultiplier(index: number): void {
    this.fileMultipliers.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const multiplier: Multiplier = {
      ...this.form.value,
      fileMultipliers: this.form.value.fileMultipliers
    };

    this.multipliersService.createMultiplier(multiplier).subscribe(multiplier => {
      if (multiplier) {
        this.closeForm();
      }
    });
  }

  cancel(): void {
    if (this.form.dirty) {
      const confirmClose = window.confirm('You have unsaved changes. Do you really want to close this form?');
      if (!confirmClose) {
        return;
      }
    }
    this.closeForm();
  }

  private closeForm() {
    this.show = false;

    this.form.reset();
    this.fileMultipliers.clear();

    this.close.emit();
  }

}
