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

