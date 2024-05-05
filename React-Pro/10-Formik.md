# Sección 10. Formik - React Forms
## Temas
useFormik

Formik Component

Formik Context

useField

Formik Custom Components

Custom Components

Metadata de los inputs

Abstractation

Yup

Validaciones tipicas

Validaciones personalizadas

## 1. Formik Instalación

```bash 
npm i formik

```

## 2. FormikBasicPage

1. .. pages -> FormikBasicPage.tsx
    - El name de los input debe coincidir con la llave del objeto correspondiente.
    - Se usa el hook useFormik, el cual por lo menos espera:
        - initialValues
        - onSubmit
    - De useFormik se destructura handleChange, values y handleSubmit, entre otras propiedades.

```tsx 
import { useFormik } from 'formik'
import '../styles/styles.css'

export const FormikBasicPage = () => {

    const { handleChange, handleSubmit, values } = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
        onSubmit: (value) => {
            console.log(value);
        }
    });

    return (
        <div>
            <h1>Formik Basic Tutorial</h1>
            <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="firstName">First Name</label>
                <input type="text" name='firstName' onChange={handleChange} value={values.firstName} />
                <span>Frist name is required</span>

                <label htmlFor="lastName">Last Name</label>
                <input type="text" name='lastName' onChange={handleChange} value={values.lastName} />
                <span>Last name is required</span>

                <label htmlFor="email">Email</label>
                <input type="text" name='email' onChange={handleChange} value={values.email} />
                <span>Email is required</span>
                <span>Check for a valid email format</span>

                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}
```

## 3. Validaciones manuales
- Se usa el campo validate de hook useFormik.
    - Se crea una función para hacer las validaciones de forma manual.
    - De useFormik se destructuran los errores para poder usarlos en el jsx.
    - De igual forma se destructura la propiedad touched, la cual se va a usar para saber si una input ha sido tocada y así poder mostrar los valores de error contemplando eso.
        - Por otro lado, se usa la propiedad onBlur de las inputs para poder aparecer los errores. On Blur ayuda a que si el usuario ingresa a input y sale sin hacer nada, activa el onChange y así se podrá mostrar el error de required.
            - De Formik se destructura handleBlur.

```tsx
import { FormikErrors, useFormik } from 'formik'
import '../styles/styles.css'

interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
}

export const FormikBasicPage = () => {

    const validate = ({ firstName, lastName, email }: FormValues) => {

        const errors: FormikErrors<FormValues> = {}; // El error es de tipo FormikErrors, el cual espera en su tipo un genérico

        if (!firstName) {
            errors.firstName = 'Required';
        } else if (firstName.length >= 15) {
            errors.firstName = 'Must be 15 characters or less';
        }


        if (!lastName) {
            errors.firstName = 'Required';
        } else if (firstName.length >= 10) {
            errors.firstName = 'Must be 10 characters or less';
        }

        if (!email) {
            errors.email = 'Required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            errors.email = 'Invalid email address';
        }

        return errors;
    }

    const { handleChange, handleSubmit, values, errors, touched, handleBlur } = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
        onSubmit: (value) => {
            console.log(value);
        },
        validate
    });

    return (
        <div>
            <h1>Formik Basic Tutorial</h1>
            <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="firstName">First Name</label>
                <input type="text" name='firstName' onChange={handleChange} value={values.firstName} onBlur={handleBlur} />
                {touched.firstName && errors.firstName && <span>{errors.firstName}</span>}

                <label htmlFor="lastName">Last Name</label>
                <input type="text" name='lastName' onChange={handleChange} value={values.lastName} onBlur={handleBlur} />
                {touched.lastName && errors.lastName && <span>{errors.lastName}</span>}

                <label htmlFor="email">Email</label>
                <input type="text" name='email' onChange={handleChange} value={values.email} onBlur={handleBlur} />
                {touched.email && errors.email && <span>{errors.email}</span>}

                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}
```

## 4. Yup - ValidationSchema Builder
- Ayuda a mejorar el sistema de validación que se hizo en el anterior paso.
1. Instalar Yup.

```bash
npm i yup
```

2. React-Pro\10-Formik\src\03-forms\pages\FormikYupPage.tsx
3. Renombrar todo al importar.

```ts
import * as Yup from 'yup'
```

4. Se usa el campo de useFormik validationSchema en conjunto con yup para definir las validaciones.

```ts
    const { handleChange, handleSubmit, values, errors, touched, handleBlur } = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
        onSubmit: (value) => {
            console.log(value);
        },
        validationSchema: Yup.object({
            firsName: Yup.string()
                .max(15, 'Debe de tener 15 caracateres o menos')
                .required('Required'),
            lastName: Yup.string()
                .max(10, 'Debe de tener 10 caracateres o menos')
                .required('Required'),
            email: Yup.string()
                .email('No tiene un formato válido de email')
                .required('Required'),
        })
    });
```

## 5. Formik getFieldProps
- Es una propiedad que se puede destructurar de useFormik, la cual es un método.
- Ayuda a resolver el problema de tener que definir manualmente los campos de onChange, name, value y onBlur en las inputs.
    - Se destructura el objeto en el input y se le pasa como argumento el nombre del campo deseado.

```tsx
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '../styles/styles.css'

export const FormikYupPage = () => {

    const { handleSubmit, errors, touched, getFieldProps } = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
        onSubmit: (value) => {
            console.log(value);
        },
        validationSchema: Yup.object({
            firsName: Yup.string()
                .max(15, 'Debe de tener 15 caracateres o menos')
                .required('Required'),
            lastName: Yup.string()
                .max(10, 'Debe de tener 10 caracateres o menos')
                .required('Required'),
            email: Yup.string()
                .email('No tiene un formato válido de email')
                .required('Required'),
        })
    });

    return (
        <div>
            <h1>Formik Yup Tutorial</h1>
            <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="firstName">First Name</label>
                <input type="text" {...getFieldProps('firstName')} />
                {touched.firstName && errors.firstName && <span>{errors.firstName}</span>}

                <label htmlFor="lastName">Last Name</label>
                <input type="text" {...getFieldProps('lastName')} />
                {touched.lastName && errors.lastName && <span>{errors.lastName}</span>}

                <label htmlFor="email">Email</label>
                <input type="text" {...getFieldProps('email')} />
                {touched.email && errors.email && <span>{errors.email}</span>}

                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}
```

## 6. Formik: componentes
1. React-Pro\10-Formik\src\03-forms\pages\FormikComponents.tsx
- Formik crea su propio contexto pasando las props que se colocan en useFormik.

### Formik
- Es un componente que evitar tener que usar el useFormik, en donde en el componente se le pasan los argumentos de useFormik como atributos.

```tsx
            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                }}
                onSubmit={(values) => {
                    console.log(values)
                }}
                validationSchema={Yup.object({
                    firsName: Yup.string()
                        .max(15, 'Debe de tener 15 caracateres o menos')
                        .required('Required'),
                    lastName: Yup.string()
                        .max(10, 'Debe de tener 10 caracateres o menos')
                        .required('Required'),
                    email: Yup.string()
                        .email('No tiene un formato válido de email')
                        .required('Required'),
                })}
            >

            </Formik>
```

### Form
- Reemplaza al elemento form de html.
- Se usa en conjunto con Field, el cual se le especifica el campo de name y type como con una input.
    - Se usa igualmente ErrorMessage, el cual se asocia con el Field por medoi del name. Igualmente, se tiene la prop component para especificar que elemento html debería envolver el mensaje de error en caso de que se desee ocupar algún elemento html.

```tsx
import { useFormik, Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import '../styles/styles.css'

export const FormikComponents = () => {

    const { handleSubmit, errors, touched, getFieldProps } = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
        onSubmit: (value) => {
            console.log(value);
        },
        validationSchema: Yup.object({
            firsName: Yup.string()
                .max(15, 'Debe de tener 15 caracateres o menos')
                .required('Required'),
            lastName: Yup.string()
                .max(10, 'Debe de tener 10 caracateres o menos')
                .required('Required'),
            email: Yup.string()
                .email('No tiene un formato válido de email')
                .required('Required'),
        })
    });

    return (
        <div>
            <h1>Formik Components</h1>

            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                }}
                onSubmit={(values) => {
                    console.log(values)
                }}
                validationSchema={Yup.object({
                    firsName: Yup.string()
                        .max(15, 'Debe de tener 15 caracateres o menos')
                        .required('Required'),
                    lastName: Yup.string()
                        .max(10, 'Debe de tener 10 caracateres o menos')
                        .required('Required'),
                    email: Yup.string()
                        .email('No tiene un formato válido de email')
                        .required('Required'),
                })}
            >

                {
                    formik => (
                        <Form onSubmit={handleSubmit} noValidate>
                            <label htmlFor="firstName">First Name</label>
                            <Field name='firstName' type='text' />
                            <ErrorMessage name='firstName' component="span" />

                            <label htmlFor="lastName">Last Name</label>
                            <Field name='lastName' type='text' />
                            <ErrorMessage name='lastName' component="span" />

                            <label htmlFor="email">Email</label>
                            <Field name='email' type='text' component="span" />
                            <ErrorMessage name='email' />

                            <button type='submit'>Submit</button>
                        </Form>
                    )
                }

            </Formik>
        </div>
    )
}
```

## 7. Selects y Checks
- A modo de mostrar su uso se agregan dos campos nuevos al initialValue:
    - terms: false
    - jobType ''

### Select
- Con un filed de tipo select se le debe poner as y no type.
    - Por otro lado, envuelve a elemento html de tipo option
```tsx
           <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                    terms: false,
                    jobType: '',
                }}
                onSubmit={(values) => {
                    console.log(values)
                }}
                validationSchema={Yup.object({
                    firsName: Yup.string()
                        .max(15, 'Debe de tener 15 caracateres o menos')
                        .required('Required'),
                    lastName: Yup.string()
                        .max(10, 'Debe de tener 10 caracateres o menos')
                        .required('Required'),
                    email: Yup.string()
                        .email('No tiene un formato válido de email')
                        .required('Required'),
                    terms: Yup.boolean()
                        .oneOf([true], 'Debe de aceptar las condiciones'), // Indica que sus posibles valores están en ese arreglo
                    jobType: Yup.string()
                        .notOneOf(['it-junior'], 'No está permitida está opción.')
                        .required('Requerido')
                    
                })}
            >

                {
                    formik => (
                        <Form onSubmit={handleSubmit} noValidate>
                            <label htmlFor="firstName">First Name</label>
                            <Field name='firstName' type='text' />
                            <ErrorMessage name='firstName' component="span" />

                            <label htmlFor="lastName">Last Name</label>
                            <Field name='lastName' type='text' />
                            <ErrorMessage name='lastName' component="span" />

                            <label htmlFor="email">Email</label>
                            <Field name='email' type='text' />
                            <ErrorMessage name='email' component="span" />

                            <label htmlFor="jobType">Job Type</label>
                            <Field name='jobType' as="select">
                                <option value="">Pick something</option>
                                <option value="developer">developer</option>
                                <option value="designer">designer</option>
                                <option value="it-senior">senior</option>
                                <option value="it-junior">junior</option>
                            </Field>
                            <ErrorMessage name='jobType' component="span" />

                            <label>
                                <Field name='terms' type='checkbox' />
                                Terms and conditions
                            </label>
                            <ErrorMessage name='terms' component="span" />

                            <button type='submit'>Submit</button>
                        </Form>
                    )
                }

            </Formik>
```

## 8. Formik - Abstraction - useField
- Se aprecia que label, Field y ErrorMessage se repite varias veces, por lo que se puede simplificar.
1. React-Pro\10-Formik\src\03-forms\pages\FormikAbstract.tsx
2. React-Pro\10-Formik\src\03-forms\components\MyTextInput.tsx
    - Formik permite tomar el formik context creado por el objeto de Formik y tomar las propiedades deseadas por medio de useField.
    - Recibe como argumento las properties que recibe la función children de Formik (la función children es como se vio con el patrón de componente state initializer)
        - Recibe los argumento ya que se colocará en el children function de Formik.

__MyTextInput.tsx__

```tsx
import { useField } from "formik"

interface Props {
    label: string;
    name: string;
    type?: 'text' | 'email' | 'password';
    placeholder?: string;
    [x: string]: any // comodín para añadir parámetros adicionales
}

export const MyTextInput = ({label, ...props}: Props) => {

    // La metadata permite saber si fue tocado el elemento, si hay errores, etc.
    // En field viene la parte de touched, onChange, etc.
    const [field, meta] = useField(props)

  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {
        meta.touched && meta.error && (
            <span className="error">{meta.error}</span>
        )
      }
    </>
  )
}



```

- Se manda a llamar dentro de Form en l children function.

```tsx
                    formik => (
                        <Form onSubmit={handleSubmit} noValidate>
                            <MyTextInput 
                                label={"First Name"} 
                                name={"firstName"} 
                                placeholder="Houser"
                            />

                            <MyTextInput 
                                label={"Last Name"} 
                                name={"lastName"} 
                                placeholder="Rivera"
                            />

                            <MyTextInput 
                                label={"Email"} 
                                name={"email"} 
                                placeholder="Houser@google.com"
                                type='email'
                            />

                            <label htmlFor="jobType">Job Type</label>
                            <Field name='jobType' as="select">
                                <option value="">Pick something</option>
                                <option value="developer">developer</option>
                                <option value="designer">designer</option>
                                <option value="it-senior">senior</option>
                                <option value="it-junior">junior</option>
                            </Field>
                            <ErrorMessage name='jobType' component="span" />

                            <label>
                                <Field name='terms' type='checkbox' />
                                Terms and conditions
                            </label>
                            <ErrorMessage name='terms' component="span" />

                            <button type='submit'>Submit</button>
                        </Form>
                    )
                }

            </Formik>
```

## 9. Formik - Custom Select
- Es igual al código de MyTextInput, solo que se usa select en lugar de input.
    - Las opciones que vienen en el select van a venir de las props (children), por lo que se convierte en un HOC.

__MySelect.tsx__
```tsx
import { useField } from "formik"

interface Props {
    label: string;
    name: string;
    placeholder?: string;
    [x: string]: any // comodín para añadir parámetros adicionales
}

export const MySelect = ({label, ...props}: Props) => {

    // La metadata permite saber si fue tocado el elemento, si hay errores, etc.
    // En field viene la parte de touched, onChange, etc.
    const [field, meta] = useField(props)

  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select {...field} {...props} />
      {
        meta.touched && meta.error && (
            <span className="error">{meta.error}</span>
        )
      }
    </>
  )
}
```

- Se importa, se envuelven las options y se elimina la label y ErroMessage.

__FormikAbstraction.tsx__
```tsx
                            <MySelect label="Job Type" name="jobType" >
                                <option value="">Pick something</option>
                                <option value="developer">developer</option>
                                <option value="designer">designer</option>
                                <option value="it-senior">senior</option>
                                <option value="it-junior">junior</option>
                            </MySelect>
```

## 10. Formik - Custom Checkbox

__MyCheckbox.tsx__
```tsx
import { useField } from "formik"

interface Props {
    label: string;
    name: string;
    [x: string]: any // comodín para añadir parámetros adicionales
}

export const MyCheckbox = ({label, ...props}: Props) => {

    // La metadata permite saber si fue tocado el elemento, si hay errores, etc.
    // En field viene la parte de touched, onChange, etc.
    const [field, meta] = useField({...props, type: 'checkbox'});

  return (
    <>
      <label>
        {/*Se esparce field y props adicionales que puedan venir. */}
        <input type="checkbox" {...field} {...props} />
        {label}
      </label>
      {
        meta.touched && meta.error && (
            <span className="error">{meta.error}</span>
        )
      }
    </>
  )
}
```

__FormikAbstraction.tsx__
```tsx
import { useFormik, Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import '../styles/styles.css'
import { MyTextInput } from '../components/MyTextInput';
import { MySelect } from '../components/MySelect';
import { MyCheckbox } from '../components/MyCheckbox';

export const FormikAbstract = () => {

    const { handleSubmit, errors, touched, getFieldProps } = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
        onSubmit: (value) => {
            console.log(value);
        },
        validationSchema: Yup.object({
            firsName: Yup.string()
                .max(15, 'Debe de tener 15 caracateres o menos')
                .required('Required'),
            lastName: Yup.string()
                .max(10, 'Debe de tener 10 caracateres o menos')
                .required('Required'),
            email: Yup.string()
                .email('No tiene un formato válido de email')
                .required('Required'),
        })
    });

    return (
        <div>
            <h1>Formik Abstractation</h1>

            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                    terms: false,
                    jobType: '',
                }}
                onSubmit={(values) => {
                    console.log(values)
                }}
                validationSchema={Yup.object({
                    firsName: Yup.string()
                        .max(15, 'Debe de tener 15 caracateres o menos')
                        .required('Required'),
                    lastName: Yup.string()
                        .max(10, 'Debe de tener 10 caracateres o menos')
                        .required('Required'),
                    email: Yup.string()
                        .email('No tiene un formato válido de email')
                        .required('Required'),
                    terms: Yup.boolean()
                        .oneOf([true], 'Debe de aceptar las condiciones'), // Indica que sus posibles valores están en ese arreglo
                    jobType: Yup.string()
                        .notOneOf(['it-junior'], 'No está permitida está opción.')
                        .required('Requerido')
                    
                })}
            >

                {
                    formik => (
                        <Form onSubmit={handleSubmit} noValidate>
                            <MyTextInput 
                                label={"First Name"} 
                                name={"firstName"} 
                                placeholder="Houser"
                            />

                            <MyTextInput 
                                label={"Last Name"} 
                                name={"lastName"} 
                                placeholder="Rivera"
                            />

                            <MyTextInput 
                                label={"Email"} 
                                name={"email"} 
                                placeholder="Houser@google.com"
                                type='email'
                            />

                            <MySelect label="Job Type" name="jobType" >
                                <option value="">Pick something</option>
                                <option value="developer">developer</option>
                                <option value="designer">designer</option>
                                <option value="it-senior">senior</option>
                                <option value="it-junior">junior</option>
                            </MySelect>

                            <MyCheckbox label="Terms & conditions" name="terms" />

                            <button type='submit'>Submit</button>
                        </Form>
                    )
                }

            </Formik>
        </div>
    )
}
```

## 11. Optimizaciones
- Se crea archivo de barril. React-Pro\10-Formik\src\03-forms\components\index.ts

```ts
export { MyCheckbox } from "./MyCheckbox";
export { MySelect } from "./MySelect";
export { MyTextInput } from "./MyTextInput";
```

- Usarlo en FormikAbstract.tsx.

```tsx
import { useFormik, Formik, Form } from 'formik'
import * as Yup from 'yup'
import '../styles/styles.css'
import { MyTextInput, MySelect, MyCheckbox } from '../components'

export const FormikAbstract = () => {

    const { handleSubmit } = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
        onSubmit: (value) => {
            console.log(value);
        },
        validationSchema: Yup.object({
            firsName: Yup.string()
                .max(15, 'Debe de tener 15 caracateres o menos')
                .required('Required'),
            lastName: Yup.string()
                .max(10, 'Debe de tener 10 caracateres o menos')
                .required('Required'),
            email: Yup.string()
                .email('No tiene un formato válido de email')
                .required('Required'),
        })
    });

    return (
        <div>
            <h1>Formik Abstractation</h1>

            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                    terms: false,
                    jobType: '',
                }}
                onSubmit={(values) => {
                    console.log(values)
                }}
                validationSchema={Yup.object({
                    firsName: Yup.string()
                        .max(15, 'Debe de tener 15 caracateres o menos')
                        .required('Required'),
                    lastName: Yup.string()
                        .max(10, 'Debe de tener 10 caracateres o menos')
                        .required('Required'),
                    email: Yup.string()
                        .email('No tiene un formato válido de email')
                        .required('Required'),
                    terms: Yup.boolean()
                        .oneOf([true], 'Debe de aceptar las condiciones'), // Indica que sus posibles valores están en ese arreglo
                    jobType: Yup.string()
                        .notOneOf(['it-junior'], 'No está permitida está opción.')
                        .required('Requerido')
                    
                })}
            >

                {
                    (_) => (
                        <Form onSubmit={handleSubmit} noValidate>
                            <MyTextInput 
                                label={"First Name"} 
                                name={"firstName"} 
                                placeholder="Houser"
                            />

                            <MyTextInput 
                                label={"Last Name"} 
                                name={"lastName"} 
                                placeholder="Rivera"
                            />

                            <MyTextInput 
                                label={"Email"} 
                                name={"email"} 
                                placeholder="Houser@google.com"
                                type='email'
                            />

                            <MySelect label="Job Type" name="jobType" >
                                <option value="">Pick something</option>
                                <option value="developer">developer</option>
                                <option value="designer">designer</option>
                                <option value="it-senior">senior</option>
                                <option value="it-junior">junior</option>
                            </MySelect>

                            <MyCheckbox label="Terms & conditions" name="terms" />

                            <button type='submit'>Submit</button>
                        </Form>
                    )
                }

            </Formik>
        </div>
    )
}
```

- Remover meta de los componentes creados para formik, ya que era para aclaración de cómo se usaba para los mensajes de error y saber si el elemento había sido tocado. Se puede usar ErrorMessage directamente.

__MyTextInput.tsx__

```tsx
import { ErrorMessage, useField } from "formik"

interface Props {
    label: string;
    name: string;
    type?: 'text' | 'email' | 'password';
    placeholder?: string;
    [x: string]: any // comodín para añadir parámetros adicionales
}

export const MyTextInput = ({label, ...props}: Props) => {

    // La metadata permite saber si fue tocado el elemento, si hay errores, etc.
    // En field viene la parte de touched, onChange, etc.
    const [field] = useField(props)

  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      <ErrorMessage name={props.name} component={'span'}/>
    </>
  )
}

```

__MySelect.tsx__
```tsx
import { ErrorMessage, useField } from "formik"

interface Props {
    label: string;
    name: string;
    placeholder?: string;
    [x: string]: any // comodín para añadir parámetros adicionales
}

export const MySelect = ({label, ...props}: Props) => {

    // La metadata permite saber si fue tocado el elemento, si hay errores, etc.
    // En field viene la parte de touched, onChange, etc.
    const [field] = useField(props)

  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select {...field} {...props} />
      <ErrorMessage name={props.name} component={'span'}/>
    </>
  )
}
```

__MyCheckbox.tsx__
```tsx
import { ErrorMessage, useField } from "formik"

interface Props {
    label: string;
    name: string;
    [x: string]: any // comodín para añadir parámetros adicionales
}

export const MyCheckbox = ({label, ...props}: Props) => {

    // La metadata permite saber si fue tocado el elemento, si hay errores, etc.
    // En field viene la parte de touched, onChange, etc.
    const [field] = useField({...props, type: 'checkbox'});

  return (
    <>
      <label>
        {/*Se esparce field y props adicionales que puedan venir. */}
        <input type="checkbox" {...field} {...props} />
        {label}
      </label>
      <ErrorMessage name={props.name} component={'span'}/>
    </>
  )
}
```

- Crear índice de pages para usarlos en Navigation.

__index.ts__
```ts
export { FormikAbstract } from "./FormikAbstraction";
export { FormikBasicPage } from "./FormikBasicPage";
export { FormikComponents } from "./FormikComponents";
export { FormikYupPage } from "./FormikYupPage";
```

# Sección 11. Formik Dynamic y Custom Forms
- El backend va a definir el formulario y sus validaciones en el frontend por medio de un JSON.

## Temas
1. Construir inputs de forma dinámica
2. Construir validaciones basados en propiedades
3. Selects, Inputs
4. Ideas para validaciones

## 1. Formularios dinámicos
1. React-Pro\10-Formik\src\03-forms\pages\DynamicForm.tsx
2. React-Pro\10-Formik\src\03-forms\data\custom-form.json

```json
[
    {
        "type": "input",
        "name": "firstName",
        "placeholder": "Houser",
        "label": "First Name",
        "value": ""
    },
    {
        "type": "input",
        "name": "lastName",
        "placeholder": "Rivera",
        "label": "Last Name",
        "value": ""
    },
    {
        "type": "email",
        "name": "email",
        "placeholder": "Houser@google.com",
        "label": "Email",
        "value": ""
    }
]
```

3. Se itera sobre los objetos del arreglo de custom-form.json para crear los elementos del form.

__DynamicForm.tsx__
```tsx
import { Form, Formik } from 'formik';
import formJson from '../data/custom-form.json';
import { MyTextInput } from '../components';

export const DynamicForm = () => {
    return (
        <div>
            <h1>Dynamic Form</h1>
            <Formik
                initialValues={{
                    name: "Houser"
                }}
                onSubmit={(values) => {
                    console.log(values);
                }}
            >
                {(formik) => (
                    <Form>
                        {formJson.map(({ type, name, placeholder, label }) => {
                            return <MyTextInput 
                                key={ name } 
                                type={(type as any)} 
                                name={name} 
                                label={label} 
                                placeholder={placeholder} />
                        })}
                        <button type='submit'>Submit</button>
                    </Form>

                )}
            </Formik>
        </div>
    )
}
```

## 2. Creando initialValues de forma dinámica
```tsx
const initialValues: {[key:string]: any} = {};

for (const input of formJson) {
    initialValues[input.name] = input.value
}

export const DynamicForm = () => {
    return (
        <div>
            <h1>Dynamic Form</h1>
            <Formik
                initialValues={initialValues}
```

## 3. Selects de manera dinámica
- Se coloca la estructura de select en el json.

__custom-form.json__
```json
[
    {
        "type": "input",
        "name": "firstName",
        "placeholder": "Houser",
        "label": "First Name",
        "value": ""
    },
    {
        "type": "input",
        "name": "lastName",
        "placeholder": "Rivera",
        "label": "Last Name",
        "value": ""
    },
    {
        "type": "select",
        "name": "favoriteGame",
        "label": "Favorite Game",
        "value": "",
        "options": [
            {
                "id": 1,
                "label": "Super Smash"
            },
            {
                "id": 2,
                "label": "Metal Gear"
            },
            {
                "id": 3,
                "label": "Resident Evil"
            }
        ]
    }
]
```

- Se renderiza condicionalmente en Formik para escoger si es input de texto o de select.

__DynamicForm.tsx__
```tsx
import { Form, Formik } from 'formik';
import formJson from '../data/custom-form.json';
import { MySelect, MyTextInput } from '../components';

const initialValues: {[key:string]: any} = {};

for (const input of formJson) {
    initialValues[input.name] = input.value
}

export const DynamicForm = () => {
    return (
        <div>
            <h1>Dynamic Form</h1>
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                    console.log(values);
                }}
            >
                {(formik) => (
                    <Form>
                        {formJson.map(({ type, name, placeholder, label, options }) => {
                            if(type === 'input' || type === 'password' || type === 'email') {
                                return <MyTextInput 
                                    key={ name } 
                                    type={(type as any)} 
                                    name={name} 
                                    label={label} 
                                    placeholder={placeholder} 
                                />
                            } else if (type === 'select') {
                                return(
                                    <MySelect 
                                        key={name}
                                        name={name} 
                                        label={label} 
                                    >
                                       <option value="">Select an option</option> 
                                       {
                                        options?.map(({id, label}) => (
                                            <option key={id} value={id}>{label}</option>
                                        ))
                                       }
                                    </MySelect>
                                )
                            }

                        })}
                        <button type='submit'>Submit</button>
                    </Form>

                )}
            </Formik>
        </div>
    )
}
```

## 4. Validaciones dinámicas
- Se coloca un campo de el json para las validaciones.

```json
[
    {
        "type": "input",
        "name": "firstName",
        "placeholder": "Houser",
        "label": "First Name",
        "value": "",
        "validations": [
            {
                "type": "required"
            },
            {
                "type": "minLength",
                "value": 5
            }
        ]
    },
    {
        "type": "input",
        "name": "lastName",
        "placeholder": "Rivera",
        "label": "Last Name",
        "value": "",
        "validations": [
            {
                "type": "required"
            }
        ]
    },
    {
        "type": "email",
        "name": "email",
        "placeholder": "Houser@google.com",
        "label": "Email",
        "value": "",
        "validations": [
            {
                "type": "required"
            },
            {
                "type": "email"
            }
        ]
    },
    {
        "type": "select",
        "name": "favoriteGame",
        "label": "Favorite Game",
        "value": "",
        "options": [
            {
                "id": 1,
                "label": "Super Smash"
            },
            {
                "id": 2,
                "label": "Metal Gear"
            },
            {
                "id": 3,
                "label": "Resident Evil"
            }
        ],
        "validations": [
            {
                "type": "required"
            }
        ]
    }
]


```

- Se crea el objeto de validaciones Yup en DynamicForm.

```tsx
import { Form, Formik } from 'formik';
import formJson from '../data/custom-form.json';
import { MySelect, MyTextInput } from '../components';
import * as Yup from 'yup';

const initialValues: {[key:string]: any} = {};
const requiredFields: {[key:string]: any} = {};

for (const input of formJson) {
    initialValues[input.name] = input.value;

    if(!input.validations) continue;

    let schema = Yup.string();

    for (const rule of input.validations) {
        if(rule.type === 'required') {
            schema = schema.required('Este campo es requerido')
        }

        if(rule.type === 'minLength'){
            schema = schema.min((rule as any).value || 1, `Mínimo de ${(rule as any).value || 1} caracteres` )
        }

        if(rule.type === 'email'){
            schema = schema.email((`No tiene formato válido de email`))
        }
    }

    requiredFields[input.name] = schema;
}

const validationSchema = Yup.object({...requiredFields});

export const DynamicForm = () => {
    return (
        <div>
            <h1>Dynamic Form</h1>
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                    console.log(values);
                }}
                validationSchema={validationSchema}
            >
                {(_) => (
                    <Form>
                        {formJson.map(({ type, name, placeholder, label, options }) => {
                            if(type === 'input' || type === 'password' || type === 'email') {
                                return <MyTextInput 
                                    key={ name } 
                                    type={(type as any)} 
                                    name={name} 
                                    label={label} 
                                    placeholder={placeholder} 
                                />
                            } else if (type === 'select') {
                                return(
                                    <MySelect 
                                        key={name}
                                        name={name} 
                                        label={label} 
                                    >
                                       <option value="">Select an option</option> 
                                       {
                                        options?.map(({id, label}) => (
                                            <option key={id} value={id}>{label}</option>
                                        ))
                                       }
                                    </MySelect>
                                )
                            }

                        })}
                        <button type='submit'>Submit</button>
                    </Form>

                )}
            </Formik>
        </div>
    )
}
```