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


