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