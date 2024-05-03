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