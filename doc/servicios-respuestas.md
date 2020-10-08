# STATUS:

# 200 - OK

Request aceptada, y se retorna el objeto. Ej: se crea una nueva caja y se retorna el objeto creado.

# 400 - Bad Request

Request mal hecha. Ej: está mal el body/JSON sintácticamente

# 404 - Not Found

Request bien hecha -sintácticamente-, pero no existe el recurso. Ej: se trata de obtener una caja que no existe

# 422 - Unprocessable Entity

Request bien hecha -sintácticamente-, pero es inválida semánticamente. Ej: se inserta o se actualiza un registro, pero falla una validación o restricción

# APIs

## Caja

/infoCaja

### REQUEST:

id

### RESPONSE:

id: number
idTipoCaja: number
idTipoContenido: number
idPlantilla: number
idEstado: number
idUsuarioAlta: number
idSectorOrigen: number
restringida: number
legajo: string
nombre: string
nombreSector: string
nombreTipoCaja: string
descripcion: string \*\*
descripcionContenido: string
fechaGeneracion: DateTime | string
fechaVencimiento: DateTime | string
fechaUltimaTransicion: DateTime | string
fechaDocumentacionDesde: DateTime | string
fechaDocumentacionHasta: DateTime | string
contenido: []

---

#### Contenido Documento

id: number
idTipoDocumento: number
tipoDocumental: string
numeroProducto: string
detalle: string
dniCuitTitular: number
nombreTitular: string
idSectorPropietario: number
claveExterna: number
fechaDocumental: DateTime | string
fechaCierre: DateTime | string
fechaDesde: DateTime | string
fechaHasta: DateTime | string
