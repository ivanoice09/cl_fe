import { Component } from '@angular/core';
import { AdminCustomerHttp } from '../../../shared/services/admin/admin-customer-http';
import { OnInit } from '@angular/core';
import { CustomerList } from '../../../shared/models/CustomerList';
import { CommonModule } from '@angular/common';
import { CustomerDetail } from '../../../shared/models/CustomerDetail';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-customer',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-customer.html',
  styleUrl: './admin-customer.scss',
})
export class AdminCustomer implements OnInit {
  customers: CustomerList[] = [];

  selectedCustomer?: CustomerDetail;
  selectedCustomerId?: number;

  page = 1;
  pageSize = 15;
  totalPages = 0;
  hasNext = false;
  hasPrevious = false;
  searchTerm: string = '';

  constructor(private adminCustomerHttp: AdminCustomerHttp, private fb: FormBuilder) {}

  ngOnInit() {
    this.loadCustomers();
  }

  // FUNZIONE DI RICERCA
  onSearch() {
    this.page = 1; // 4. Reset pagina a 1 quando si cerca
    this.loadCustomers();
  }

  editForm!: FormGroup;

  // 2. Creiamo un flag per lo stato della UI (permette di switchare tra testo e input nell'HTML)
  isEditing = false;

  // 3. Inizializziamo il form: serve a trasformare i dati statici in oggetti "reattivi" che Angular può controllare
  startEdit() {
    if (!this.selectedCustomer) return;
    this.editForm = this.fb.group({
      // 4. Validators.required: impedisce il salvataggio se il campo è vuoto, garantendo dati puliti
      customerId: [this.selectedCustomer.customerId],
      firstName: [this.selectedCustomer.firstName, Validators.required],
      lastName: [this.selectedCustomer.lastName, Validators.required],
      // 5. Validators.email: verifica automaticamente il formato @, evitando errori di battitura comuni
      emailAddress: [this.selectedCustomer.emailAddress, [Validators.required, Validators.email]],
      phone: [this.selectedCustomer.phone],

      // 6. fb.array: crea una lista dinamica di form, necessaria perché un cliente può avere N indirizzi
      addresses: this.fb.array(
        this.selectedCustomer.addresses.map((addr) =>
          this.fb.group({
            addressId: [addr.addressId], // 7. Teniamo l'ID nascosto per dire al database quale riga aggiornare
            addressLine1: [addr.addressLine1, Validators.required],
            city: [addr.city, Validators.required],
            postalCode: [addr.postalCode],
          })
        )
      ),
    });
    this.isEditing = true;
  }

  // 8. Getter addressControls: serve all'HTML per "ciclare" sugli indirizzi senza scrivere codice complesso nel template
  get addressControls() {
    return (this.editForm.get('addresses') as FormArray).controls;
  }

  // 9. Funzione di salvataggio: estrae i dati dal form e li invia al backend
  save() {
    if (this.editForm.valid) {
      const payload = this.editForm.value;

      this.adminCustomerHttp.updateCustomer(payload).subscribe({
        next: (res) => {
          // 1. Forza il ricaricamento completo della pagina dal browser
          // Motivazione: È il modo più brutale ma efficace per essere sicuri che
          // tutta la UI (lista e dettagli) sia sincronizzata con il database.
          window.location.reload();
        },
        error: (err) => {
          console.error('Errore durante il salvataggio', err);
          alert('Errore durante il salvataggio!');
        },
      });
    }
  }

  deleteCustomer(customerId: number) {
    // 1. Chiediamo conferma all'utente
    // Motivazione: Preveniamo la perdita accidentale di dati causata da un click sbagliato.
    if (confirm('Sei sicuro di voler eliminare questo cliente?')) {
      this.adminCustomerHttp.deleteCustomer(customerId).subscribe({
        next: () => {
          // 2. Ricarichiamo la pagina dopo il successo
          // Motivazione: Come per il salvataggio, il reload garantisce che la lista mostrata sia quella aggiornata senza il cliente rimosso.
          window.location.reload();
        },
        error: (err) => {
          console.error("Errore durante l'eliminazione", err);
          alert('Impossibile eliminare il cliente. Potrebbe avere degli ordini collegati.');
        },
      });
    }
  }

  loadCustomers() {
    this.adminCustomerHttp
      .getCustomerList(this.page, this.pageSize, this.searchTerm)
      .subscribe((res) => {
        //console.log('Risposta ricevuta:', res);
        this.customers = res.items;
        this.totalPages = res.totalPages;
        this.hasNext = res.hasNext;
        this.hasPrevious = res.hasPrevious;
      });
  }

  selectCustomer(customerId: number) {
    //console.log("Cliccato ID:", customerId);

    if (this.selectedCustomerId === customerId) {
      this.selectedCustomerId = undefined;
      this.selectedCustomer = undefined;
      return;
    }

    this.adminCustomerHttp.getCustomerDetail(customerId).subscribe((detail) => {
      //console.log('Dettaglio ricevuto:', detail); // <--- CONTROLLA QUI
      this.selectedCustomerId = customerId;
      this.selectedCustomer = detail;
    });
  }

  nextPage() {
    if (this.hasNext) {
      this.page++;
      this.loadCustomers();
    }
  }

  prevPage() {
    if (this.hasPrevious) {
      this.page--;
      this.loadCustomers();
    }
  }
}
