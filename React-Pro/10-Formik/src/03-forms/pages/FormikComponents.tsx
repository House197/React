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
        </div>
    )
}