import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '../../../../../common-ui/base.component';
import { Ticket } from '../../../../../models/ticket.model';
import { TraspasoDataService } from '../../../../../service/data/traspaso-data.service';
import { HardcodedAutheticationService } from '../../../../../service/hardcoded-authetication.service';

@Component({
  selector: 'app-traspasar-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './traspasar-ticket.component.html',
  styleUrl: './traspasar-ticket.component.scss'
})
export class TraspasarTicketComponent extends BaseComponent {
  traspasoForm: FormGroup;
  ticket: Ticket;
  mensaje: string = '';

  constructor(
    protected override dialog: MatDialog,
    private dialogRef: MatDialogRef<TraspasarTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ticket: Ticket },
    private fb: FormBuilder,
    private traspasoService: TraspasoDataService,
  ) {
    super(dialog);
    this.ticket = data.ticket;
    this.traspasoForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  get correoControl() {
    return this.traspasoForm.get('correo');
  }

  get isFormValid(): boolean {
    return this.traspasoForm.valid && !this.isTicketUtilizado;
  }

  get isTicketUtilizado(): boolean {
    return this.ticket && (this.ticket.estado !== 1 || this.ticket.utilizado === true);
  }

  onTransferir(): void {
    if (!this.isFormValid) return;

    this.iniciarCarga();
    const correo = this.correoControl?.value;

    this.traspasoService.transferirTicket(this.ticket.id, correo)
      .subscribe({
        next: (response) => {
          this.finalizarCarga();
          this.mensaje = response.mensaje || 'Ticket transferido exitosamente';
          this.mostrarMensaje(this.mensaje).subscribe(() => {
            this.dialogRef.close(true);
          });
        },
        error: (error) => {
          this.finalizarCarga();
          const mensajeError = error?.error?.mensaje || 'Error al transferir el ticket';
          this.mostrarError(mensajeError);
        }
      });
  }

  onCerrar(): void {
    this.dialogRef.close(false);
  }
}
