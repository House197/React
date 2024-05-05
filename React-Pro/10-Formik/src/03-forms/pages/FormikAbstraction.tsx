import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import '../styles/styles.css'
import { MyTextInput, MySelect, MyCheckbox } from '../components'

export const FormikAbstract = () => {

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
                        <Form>
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