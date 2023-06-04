## ECG Checker

### Introduction


### Installation

#### Requirements

- Node 18.16.0
- Ionic 7.0.1 -> actualizado a 7.1.1
- Angular 16.0.0

#### Iniciar aplicación

- Clonar el repositorio
- Instalar dependencias con `npm install`
- Iniciar aplicación con `ionic serve`
- Abrir navegador en `http://localhost:8100/`



#### Tips y comandos útiles

Estos comandos utiles nos ayudan a resolver problemas de dependencias, en este caso se uso
para integrar chart.js on ionic.
- Para actualizar ionic (se hace globalmente)  `npm install -g @ionic/cli` (primero hay que desinstalar)
- Para actualizar angular en el proyecto `ng update` (Nos muestra las dependencias que se pueden actualizar)
- Para actualizar dependencias de angular `ng update @angular/core @angular/cli` (por ejemplo)
- Si aun con la actualización hay errores para instalar mas dependencias
entonces hay que degradar algunas dependencias `npm install eslint@7 --save-dev` (por ejemplo)

#### Ultimo estado de Angular: 

```console
Angular CLI: 16.0.0
Node: 18.16.0
Package Manager: npm 9.5.1

Package                         Version
---------------------------------------------------------
@angular-devkit/architect       0.1600.0
@angular-devkit/build-angular   16.0.0
@angular-devkit/core            15.2.6
@angular-devkit/schematics      15.2.6
@schematics/angular             15.2.6
rxjs                            7.5.7
typescript                      5.0.4
```
