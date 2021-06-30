import { AfterViewInit, COMPILER_OPTIONS, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Lugar } from '../interfaces/Lugar';
declare const google: any;
// import { google } from 'google-maps';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit, AfterViewInit {

  @ViewChild('map', { static: false }) mapaElement: ElementRef;
  map: google.maps.Map;

  lugares: Lugar[] = [
    {
      nombre: 'Udemy',
      lat: 37.784679,
      lng: -122.395936
    },
    {
      nombre: 'Bahía de San Francisco',
      lat: 37.798933,
      lng: -122.377732
    },
    {
      nombre: 'The Palace Hotel',
      lat: 37.788578,
      lng: -122.401745
    }
  ];

  marcadores: google.maps.Marker[] = [];
  infoWindows: google.maps.InfoWindow[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.cargarMapa();
  }

  cargarMapa(): void {

    const latLng = new google.maps.LatLng(37.784679, -122.395936);
    const mapaOpciones: google.maps.MapOptions = {
      center: latLng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapaElement.nativeElement, mapaOpciones);

    this.map.addListener('click', (coors) => {
      const nuevoMarcador: Lugar = {
        nombre: 'Nuevo Lugar',
        lat: coors.latLng.lat(),
        lng: coors.latLng.lat(),
        id: new Date().toISOString()
      };

      this.agregarMarcador(nuevoMarcador);

      // Emitir eventosocket

    });



    for (const lugar of this.lugares) {
      this.agregarMarcador(lugar);
    }

  }


  agregarMarcador(marcador: Lugar): void {
    console.log(marcador);
    const latLng = new google.maps.LatLng(marcador.lat, marcador.lng);
    const marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      draggable: true
    });

    this.marcadores.push(marker);

    const contenido = `<b>${marcador.nombre}</b>`;
    const infoWindow = new google.maps.InfoWindow({
      content: contenido
    });

    this.infoWindows.push(infoWindow);

    google.maps.event.addDomListener(marker, 'click', () => {
      this.infoWindows.forEach(infoW => infoW.close());
      infoWindow.open(this.map, marker);

    });

    google.maps.event.addDomListener(marker, 'dblclick', (coors) => {
      marker.setMap(null);
      // Disparar un evento de socket, para borrar el marcador

    });

    google.maps.event.addDomListener(marker, 'drag', (coors) => {
      const nuevoMarcador = {
        lat: coors.latLng.lat(),
        lng: coors.latLng.lng(),
        nombre: marcador.nombre
      };
      console.log(nuevoMarcador);


      // Disparar un evento de socket, para mover el marcador

    });

  }
}
