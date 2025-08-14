import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registrarse',
    loadComponent: () => import('./components/registrarse/registrarse.component').then(m => m.RegistrarseComponent)
  },
  {
    path: 'logout',
    loadComponent: () => import('./components/logout/logout.component').then(m => m.LogoutComponent)
  },
  {
    path: 'error',
    loadComponent: () => import('./components/error/error.component').then(m => m.ErrorComponent)
  },
  {
    path: 'recuperar-contrasena/:id',
    loadComponent: () => import('./components/recuperar-contrasena/recuperar-contrasena.component').then(m => m.RecuperarContrasenaComponent)
  },
  {
    path: 'usuario-perfil',
    loadComponent: () => import('./components/usuario/usuario-perfil/usuario-perfil.component').then(m => m.UsuarioPerfilComponent)
  },
  {
    path: 'eventos',
    children: [
      {
        path: 'evento/:id',
        loadComponent: () => import('./components/eventos/eventos-perfil/eventos-perfil.component').then(m => m.EventosPerfilComponent)
      },
      {
        path: 'evento/:id/promotor/:idPromotor',
        loadComponent: () => import('./components/eventos/eventos-perfil/eventos-perfil.component').then(m => m.EventosPerfilComponent)
      },
      {
        path: ':id/cortesia/:codigoId',
        loadComponent: () => import('./components/eventos/eventos-perfil/codigo-cortesia/codigo-cortesia.component').then(m => m.CodigoCortesiaComponent)
      },
      {
        path: 'carrito/:idOrden',
        loadComponent: () => import('./components/eventos/eventos-perfil/carrito-final/carrito-final.component').then(m => m.CarritoFinalComponent)
      },
      {
        path: 'respuesta/:idOrden',
        loadComponent: () => import('./components/eventos/eventos-perfil/respuesta/respuesta.component').then(m => m.RespuestaComponent)
      },
      {
        path: 'evento/:id/seleccion-localidad',
        loadComponent: () => import('./components/eventos/eventos-perfil/seleccion-localidad/seleccion-localidad.component').then(m => m.SeleccionLocalidadComponent)
      },
      {
        path: 'carrito-de-compras',
        loadComponent: () => import('./components/eventos/eventos-perfil/compras-pendientes/compras-pendientes.component').then(m => m.ComprasPendientesComponent)
      },
      {
        path: '',
        loadComponent: () => import('./components/eventos/eventos.component').then(m => m.EventosComponent)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
