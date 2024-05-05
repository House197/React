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


