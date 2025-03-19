import { Routes } from '@angular/router';
import { MainComponent } from './component/main/main.component';
import { HomeComponent } from './component/home/home.component';
import { InvoiceComponent } from './component/main/invoice/invoice.component';
import { ReportComponent } from './component/main/report/report.component';
import { MainHomeComponent } from './component/main/main-home/main-home.component';
import { AdminComponent } from './component/main/admin/admin.component';
import { authGuard } from '../app/component/data/auth-guard/auth.guard';
import { roleGuard } from '../app/component/data/role-guard/role.guard';
import { InvoiceGeneratorComponent } from './component/main/invoice-generator/invoice-generator.component';
import { VendorBillComponent } from './component/main/vendor-bill/vendor-bill.component';
import { ClientComponent } from './component/main/client/client.component';
import { VendorComponent } from './component/main/vendor/vendor.component';
import { NuserComponent } from './component/main/nuser/nuser.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['nuser', 'admin'] },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'invoice', component: InvoiceComponent },
      {
        path: 'bill',
        component: VendorBillComponent,
      },
      {
        path: 'client',
        component: ClientComponent,
      },
      {
        path: 'vendor',
        component: VendorComponent,
      },
      {
        path:'nuser',
        component:NuserComponent
      },
      { path: 'report', component: ReportComponent },
      { path: 'home', component: MainHomeComponent },
      {
        path: 'genInvoice',
        component: InvoiceGeneratorComponent,
      },
    ],
  },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
  },
  { path: '**', redirectTo: '' },
];
