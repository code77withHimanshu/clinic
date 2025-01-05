import { Routes } from '@angular/router';
import { DoctorsComponent } from './doctors/doctors.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { WeatherComponent } from './weather/weather.component';

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
    },
    {
        path:'weather',
        component: WeatherComponent
    }
];
