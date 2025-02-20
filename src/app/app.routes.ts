import { Routes } from '@angular/router';
import { MainComponent } from './component/main/main.component';
import { HomeComponent } from './component/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'main', component: MainComponent },
    { path: '**', redirectTo: '' }
];
