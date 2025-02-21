import { Routes } from '@angular/router';
import { MainComponent } from './component/main/main.component';
import { HomeComponent } from './component/home/home.component';
import { InvoiceComponent } from './component/main/invoice/invoice.component';
import { ReportComponent } from './component/main/report/report.component';
import { MainHomeComponent } from './component/main/main-home/main-home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'main',
        component: MainComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'invoice', component: InvoiceComponent },
            { path: 'report', component: ReportComponent },
            {
                path: 'home',
                component: MainHomeComponent
            },

        ]
    },
    { path: '**', redirectTo: '' }
];
