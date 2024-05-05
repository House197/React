import '../styles/styles.css';
import {Form, Formik } from 'formik';
import * as Yup from 'yup';
import { MyTextInput } from '../components';

export const RegisterFormikPage = () => {

    return (
        <div>
            <h1>Register Formik Page</h1>
           <Formik 
           initialValues={{
                name: '',
                email: '',
                password1: '',
                password2: '',
            }} 
           onSubmit={(values) => {
            console.log(values);
           }}           
           validationSchema={Yup.object({
                name: Yup.string()
                        .min(2, 'Debe ser mayor a dos caracteres')
                        .max(15, 'Debe tener menos de 15 caracteres')
                        .required('Requerido'),
                email: Yup.string()
                        .email('No tiene un formato válido de email')
                        .required('Requerido'),
                password1: Yup.string()
                        .min(6, 'Debe tener al menos 6 caracteres')
                        .required('Requerido'),
                password2: Yup.string()
                        .oneOf([Yup.ref('password1')], 'Las contraseñas no son iguales')
                        .required('Requerido')
           })}
           >

            {
                ({handleReset}) => (
                    <Form>
                        <MyTextInput 
                            label='Name'
                            name='name'
                            type='text'
                            placeholder='Houser'
                        />

                        <MyTextInput 
                            label='Email'
                            name='email'
                            type='text'
                            placeholder='Houser@google.com'
                        />

                        <MyTextInput 
                            label='Password'
                            name='password1'
                            type='password'
                            placeholder='********'
                        />

                        <MyTextInput 
                            label='Confirm Password'
                            name='password2'
                            type='password'
                            placeholder='********'
                        />

                        <button type="submit">Create</button>
                
                        <button type="button" onClick={ handleReset }>Reset Form</button>
                    </Form>
                )
            }


           </Formik>

        </div>
    )
}