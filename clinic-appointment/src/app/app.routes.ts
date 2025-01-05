import { Routes } from '@angular/router';
import { DoctorsComponent } from './doctors/doctors.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { DisplayTimeComponent } from './display-time/display-time.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'doctors',
        pathMatch:'full'
    },
    {
        path:'doctors',
        component: DoctorsComponent
    },
    {
        path:'top-bar',
        component: TopBarComponent
    }
];
