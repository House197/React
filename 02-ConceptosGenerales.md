# Sección 02. Introducción a React y conceptos generales
## Temas
1. ¿Qué es React?
2. Conceptos generales
3. Babel
4. JSX

## 1. React
- Es una librería para la creación de aplicaciones.
    - Es posible pear script con src a react y así poder usarlo, pero no es la forma normal de trabajar con React. 
- Es declarativa, por lo que es fácil aplicar patrones de diseño y crear UI interactivas.
- Eficiente. Un cambio en el DOM hace que React solo haga el cambio en el elemento que cambia.
- Predecible. La información fluye en una guía.
- Componentes.
- Server-side con Node.
- Aplicaciones móviles con React Native.

## 2. JXK
- JSX = JS + XML

``` js
    const h1Tag = <h1>Hola Mundo</h1>
```

## 3. Babel
- Se encarga de transpilar código de JS a otras versiones. Por ejemplo, ocupar características de JS más recientes en navegadores web que por el momento no las aceptan.
- Es un compilador de JS.

# Sección 03. Introducción a JavaScript moderno
## Temas
1. Generar la base sobre JavaScript
2. Constantes y variables Let
3. Template String
4. Objetos literales
5. Arreglos
6. Desestructruación * (sumamente importante)
7. Promesas
8. Fetch API
9. Ternarios
10. Async - Await

## 1. Template String
``` js
const value = 3
const template = `Hola mundo, ${value}`
```

## 2. Objeto literal
1. __proto__ se puede ver como el ADN. Contiene métodos, getters y setters.

``` js
const persona = {
    nombre: 'Tony',
    apellido: 'Stark'
}
```

### Desestructuración Objetos
#### Cambio de nombre
- Se puede cambiar el nombre de la variable en la propia desestructuración

``` js 
const persona = {
    nombre: 'Tony',
    edad: 35,
    clave: 'IM'
}

const { nombre:nombre2 } = persona;

console.log(nombre2);
``` 

#### En argumentos en función
- Es posible asignar un valor por defecto si la variable que se espera no viene en el objeto.

``` js
const retornaPersona = ({nombre, edad, rango = 'Capi'}) => {

}
```

#### Desestructuración de objetos anidados

``` js
const persona = {
    nombre: 'A',
    objetoAnidado: {
        lat: 1,
        lon: 2
    }
}

const {nombre, objetoAnidado:{lat, lng} } = persona;
console.log(nombreClave, anios, lat, lng);
```

## 3. Arreglos
### Desestructuración de arreglos
``` js
const personajes = ['A', 'B', 'C'];

const [ A ] = personajes; // 'A'
const [ , B ] = personajes; // 'B'
const [ , , C ] = personajes; // 'C'

``` 

## 4. Funciones
- Si no tienen un return explícito retorna undefined.
- Se recomienda crearlas con const y no de forma directa, ya que el const evita que se intente reasignar el valor.

``` js
function saludar(value){
    return value
}

saludar=30

const saludar2 = function(value){
    return value
}
```

- En fuciona de flecha para retornar objetos de forma directa se deben envolver entre ().

``` js
const getUser => ({id: 1, user: 'H'})
```

## 5. Exportaciones e importaciones
### Export default
- Se utiliza para indicar la exportación por defecto en un archivo.

``` js
export default [1,2,3]
```

- Se recomienda colocarle un nombre a la exportación:

``` js
const a = [1,2,3]

export default a;
```

-Se importa únicamente colocando el nombre del archivo.

``` js
import heroes from './data/heroes'
```

### Export
- Se utiliza en un archivo para hacer varias exportaciones de variables.

``` js
export const a = [2,3,4]
export const b = [1,2,3]
```

-Se realiza una destructuración para importar.

``` js
import {a, b} from './data/heroes'
```

### Exportaciones por defecto en conjunto con exportaciones

```js
const heroes = [1,2,3];

export const a = 1;

export default heroes;
```

- También se puede hacer de la siguiente manera:

``` js
const heroes = [1,2,3];

const a = 1;

export {
    heroes as default, 
    a
};
```

- Se importan como un listado:

``` js
import heroes, {a} from './heroes'
```

## 6. PROMESAS
``` TS
const promesa = new Promise((resolve, reject) => {
	setTimeout(() => {
		console.log('2 segundos después');
		//resolve('Valor');
		reject('value error')
	}, 2000)
})

promesa.then((value) => {
	console.log(value); // Valor
}).catch((err) => console.log(err)) // value error
```

``` ts
const getHeroeByIdAsync = (id) => {
	return new Promise((resolve, reject) => {
	setTimeout(() => {
		console.log('2 segundos después');
		//resolve('Valor');
		reject('value error')
	}, 2000)
	})
}
```

## 7. Operador ternario y demás
- Si solo se tiene una respuesta en el ternario, es decir que uno de sus posibles resultados es null, entonces se debe usar &&

``` ts
const mensaje = !active && 'Encendido'
```


``` py

    params = {
        'id_area': id_area,
        'id_planner': id_planner,
        'lines_list': lines_list,
        'id_partnumber': id_partnumber,
        'simulation_mode': simulation_mode,
        'DateWeek': date
    }

	def Rollback():
		from datetime import datetime
        id_area: params['id_area'],
        id_planner: params['id_planner'],
        id_lines: params['id_lines'],
        id_partnumber: params['id_partnumber'],
        simulation_mode: params['simulation_mode'],
        DateWeek: params['date']
 

		DateStart = DateWeek[0]
		DateEnd = DateWeek[-1]
		now = system.date.now()
		dt = datetime.now()
		DateStartProduction = DateWeek[dt.weekday()]
		DataProduction = []
		
		limit1 = system.date.setTime(now, 7, 0, 0)
		limit2 = system.date.setTime(now, 15, 0, 0)
		limit3 = system.date.setTime(now, 23, 0, 0)
		
		if simulation_mode:
			tableRealtime = 'PP_realtime_sim'
			tableProduction = 'PP_PlanProduction_sim'
			tableLine = 'c_line_sim'
		else:
			tableRealtime = 'PP_realtime'
			tableProduction = 'PP_PlanProduction'
			tableLine = 'c_line'

        where_conditions = []

        sql_delete = '''
            DELETE FROM {tableRealtime} WHERE id_type = 3 AND entry_date BETWEEN ? AND ? AND id_line IN({linesTuple}) AND {partnumber_condition}
        '''

        sql_line = '''
			SELECT id_line FROM {} WHERE id_plannerSequence = {} AND id_area = {}
		'''.format(tableLine, id_planner, id_area)
		
        sql_c_partnumber = "SELECT id_c_partnumber FROM partnumber where id_partnumber = ?"

        query_filter = '1=1'

		if 0 in id_lines:
			query_filter= 'partnumber.id_area = ' + str(id_area)
			lines_to_delete = self._getBySQL(sql_line, [])
			lines = ', '.join(map(str, lines_to_delete.getColumnAsList(0)))
        else:
			lines = ', '.join(map(str, lines_to_delete.getColumnAsList(0)))

		if id_partnumber == 0:
			query_filter= 'partnumber.id_line IN ' + str(lines_list)
		else:
            id_partnumber_catalogue = system.db.runPrepQuery(sql_c_partnumber, [id_partnumber]).getValueAt(0, "id_c_partnumber")
			condition = 'partnumber = {}'.format(id_partnumber_catalogue)
			where_conditions.append(condition)
			query_filter= 'partnumber.id_partnumber = ' + str(id_partnumber)

        where_clause = ' AND '.join(where_conditions) if len(where_conditions) else '1=1'

        sql_delete = sql_delete.replace('{tableRealTime}', tableRealTime)
		sql_delete = sql_delete.replace('{id_lines}', lines)
		sql_delete = sql_delete.replace('{partnumber_condition}', where_clause)

		self._update(queryDelete, [DateStart,DateEnd])
		
				
		queryPlanProduction = """SELECT PP.id_plan, PP.id_partnumber, partnumber.id_c_partnumber, partnumber.partnumber, partnumber.description, partnumber.id_area, c_area.area, partnumber.id_line, c_line.line_name,  PP.Date, PP.Turno1, PP.Turno2, PP.Turno3
								FROM """ + tableProduction + """ PP
								INNER JOIN partnumber ON partnumber.id_partnumber = PP.id_partnumber
								INNER JOIN c_line ON c_line.id_line = partnumber.id_line
								INNER JOIN c_area ON c_area.id_area = partnumber.id_area
								WHERE """ + query_filter + """ AND PP.Date BETWEEN ? AND ?
								ORDER BY PP.Date, PP.id_partnumber"""
				
		datalistPlanProduction = system.db.runPrepQuery(queryPlanProduction, [DateStartProduction, DateEnd])
		datasetPlanProduction = system.dataset.toDataSet(datalistPlanProduction)
		
		
		
		for rowProduction in datalistPlanProduction:
			id_partnumber = rowProduction['id_partnumber']
			id_c_partnumber = rowProduction['id_c_partnumber']
			id_line = rowProduction['id_line']
			partnumber = rowProduction['partnumber']
			Date = rowProduction['Date']
			Turno1 = rowProduction['Turno1']
			Turno2 = rowProduction['Turno2']
			Turno3 = rowProduction['Turno3']
			TurnosList = [Turno1, Turno2, Turno3]
			print id_partnumber, TurnosList, Date
			
			limit1 = system.date.setTime(Date, 7, 0, 0)
			limit2 = system.date.setTime(Date, 15, 0, 0)
			limit3 = system.date.setTime(Date, 23, 0, 0)
			
			if now > limit1 and now < limit2:
				TurnosList = [Turno1, Turno2, Turno3]
			elif now > limit2 and now < limit3:
				TurnosList = [0, Turno2, Turno3]
			elif now > limit3:
				TurnosList = [0, 0, Turno3]	
			else:
				TurnosList = [Turno1, Turno2, Turno3]
			
	
			
			for id_shift in range(1,4):
				quantity = TurnosList[id_shift-1]
				id_type = 3
				rowDataProduction = [id_c_partnumber, Date, id_shift, quantity, id_type, now, id_line]
				dataConsult = [id_c_partnumber, Date, id_shift, id_type, id_line]
				queryConsult = 'SELECT * FROM PP_realtime WHERE id_partnumber = ? AND entry_date = ? AND id_shift = ? AND id_type = ? AND id_line = ?' 
				datalistConsult = system.db.runPrepQuery(queryConsult, dataConsult)
				Consult = len(datalistConsult)
				if Consult == 0:
					DataProduction.append(rowDataProduction)
				else:
					pass
		
		n = 200
		
		segmentado =[DataProduction[i:i + n] for i in range(0, len(DataProduction), n)]
		
		for rowsegmentado in segmentado:
			rowInsert=[]
			stringValue = "" 
			for rowData in rowsegmentado:
				for item in rowData: 
					rowInsert.append(item)
				stringValue += "(?,?,?,?,?,?,?), "	
			queryInsert = "INSERT INTO " + tableRealtime + " (id_partnumber, entry_date, id_shift, quantity, id_type, t_stamp, id_line) VALUES "+stringValue
			print queryInsert
			size = len(queryInsert)
			queryInsert = queryInsert[0:size-2]
			system.db.runPrepUpdate(queryInsert,rowInsert)
```





``` py
{
    'date': Sun Apr 14 00:00:00 CST 2024, 
    'id_partnumber': 147, 
    'simultaneous': 1, 
    'id_area': 7, 
    'simultaneous_list': [147], 
    'shifts_enabled': {u'0': [False, True, False], u'1': [True, True, False], u'2': [True, True, False], u'3': [True, False, True], u'4': [False, True, False], u'5': [False, True, False], u'6': [True, True, False]}, 
    'simultaneous2_list': [147], 
    'simultaneous2': 0, 
    'is_simulation': False, 
    'id_line': 66,
    'table': 'PP_realtime'
}


{'date': Sun Apr 14 00:00:00 CST 2024, 
'id_partnumber': 147, 
'simultaneous': 1, 
'id_area': 'No se usa', 
'simultaneous_list': [147, 148], 'shifts_enabled': {u'0': [False, True, False], u'1': [True, True, False], u'2': [True, True, False], u'3': [True, False, True], u'4': [False, True, False], u'5': [False, True, False], u'6': [True, True, False]}, 
'simultaneous2_list': [147, 148], 
'simultaneous2': 'No se usa, se calcula dentro del script', 
'is_simulation': 'aca no se usa, pero \xc3\xad en el script propio', 
'id_line': 66, 
'table': u'PP_realtime'}



{
    'date': Fri Apr 12 00:00:00 CST 2024, 
    'id_partnumber': 147, 
    'simultaneous': 1, 
    'id_area': 'No se usa', 
    'simultaneous_list': [147, 148], 
    'shifts_enabled': {u'0': [False, True, False], u'1': [True, True, False], u'2': [True, True, False], u'3': [True, False, True], u'4': [False, True, False], u'5': [False, True, False], u'6': [True, True, False]}, 
    'simultaneous2_list': [147, 148], 
    'simultaneous2': 'No se usa, se calcula dentro del script', 
    'is_simulation': 'aca no se usa, pero \xc3\xad en el script propio', 
    'id_line': 66,
    'table': u'PP_realtime'
}



```


