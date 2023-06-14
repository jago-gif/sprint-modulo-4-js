export class Pokemon {
  constructor(id, nombre, alto, ancho, imagen, tipo, estadisticas) {
    this._id = id;
    this._nombre = nombre;
    this._alto = alto;
    this._ancho = ancho;
    this._imagen = imagen;
    this._tipo = tipo || [];
    this._estadisticas = estadisticas || [];
  }

  // Getter y Setter para la propiedad _id
  get id() {
    return this._id;
  }
  set id(id) {
    this._id = id;
  }

  // Getter y Setter para la propiedad _nombre
  get nombre() {
    return this._nombre;
  }
  set nombre(nombre) {
    this._nombre = nombre;
  }

  // Getter y Setter para la propiedad _alto
  get alto() {
    return this._alto;
  }
  set alto(alto) {
    this._alto = alto;
  }

  // Getter y Setter para la propiedad _ancho
  get ancho() {
    return this._ancho;
  }
  set ancho(ancho) {
    this._ancho = ancho;
  }

  // Getter y Setter para la propiedad _imagen
  get imagen() {
    return this._imagen;
  }
  set imagen(imagen) {
    this._imagen = imagen;
  }

  // Getter y Setter para la propiedad _tipo
  get tipo() {
    return this._tipo;
  }
  set tipo(tipo) {
    this._tipo = tipo;
  }

  // Getter y Setter para la propiedad _estadisticas
  get estadistica() {
    return this._estadisticas;
  }
  set estadistica(estadistica) {
    this._estadisticas = estadistica;
  }
}