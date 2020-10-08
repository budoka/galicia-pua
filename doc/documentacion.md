# Actions

_src/actions_ - Se definen las acciones que permiten actualizar el estado de la app.

Para agregar un nuevo _action_ se debe agregar una carpeta como la de _settings_, y se deben definir correctamente sus elementos.

# Reducers

_src/reducers_ - Se definen las funciones "reductoras" que indican como se va a actualizar el estado de la app.

Para agregar un nuevo _reducer_ se debe agregar una carpeta como la de _settings_, y se deben definir correctamente sus elementos.

# Store

_src/store_ - Se define como va a estar compuesto el store que va a persistir el estado de la app.

Lo único se puede modificar es la propiedad _blacklist_ del objeto _persistConfig_, para indicar si debe guaradar el estado del reducer indicado en el (local) storage del navegador.

# Components

_src/components_ - Son los componentes que se puede reutilizar.

# Views

_src/views_ - Las nuevas vistas se deben agregar en _src/views/index.tsx_, y luego crear la misma (el JSX/componentes) en _src/views_

# Services

_src/services/apis-data.ts_ - Los nuevos servicios se deben agregar acá.

Para acceder al servicio se debe usar la función _getAPIData_ de src/utils/api.ts, para recuperar la url y el método (recurso). Consultar las referencias del método para ver como se utiliza.

# Utils

_src/utils_ - Son las funciones que se pueden reutilizar.

# Helpers

_src/helpers_ - Son las funciones que resuelven algo específico que, por lo general, no se vuelven a utilizar.

# Styles

_src/styles_ - Son los estilos de AntD.

El único archivo que se podría modificar es _src/styles/antd-overrides.less_ (que sobreescribe las variables del estilo de Antd).

Para definir los estilos de la app se deben hacer en _src/components/app/style.less_

Para definir los estilos de un componente se deben hacer en _src/components/<componente>/style.less_ o _src/components/<componente>/style.module.less_
