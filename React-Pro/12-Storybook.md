# Sección 12. Storybook - Cama de creación y mantenimiento de componentes y paquetes
## Temas
1. Integrar Storybook en una aplicación de React con Npx
2. Crear un componente desde cero
3. Crear historias
4. Configurar historias
5. Utilizar varios controles para las properties
6. Integración con TypeScript
7. Crear documentaciones de componentes
8. Desplegar documentación a diferentes sitios
9. Bonus: Chromatic para desplegar Storybook de forma colaborativa

## 1. Instalar y configurar
1. Ejecutar comando en el root del proyecto.

```bash
npx storybook@latest init
```

- Apenas termine la instalación se va desplegar el proyecto en el navegador. Automáticamente corre el script para levantar el proyecto, el cual es el siguiente, ubicado en package.json.

``` json
    "storybook": "storybook dev -p 6006"
```

2. Cambiar script de por:

``` json
    "dev": "vite" -> "dev": "npm run storybook",
```

## 2. Componente - MyLabel
1. React-Pro\12-storybook\src\components\MyLabel.tsx

```tsx
import './MyLabel.css'

export const MyLabel = () => {
  return (
    <div>Hola mundo</div>
  )
}
```

- Se coloca el archivo de estilo al mismo nivel del componente.

__MyLabel.css__
```css
.label {
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

.normal {
    font-size: 14px;
}
.h1 {
    font-size: 30px;
}
.h2 {
    font-size: 25px;
}
.h3 {
    font-size: 20px;
}

.text-primary {
    color: #3d5a80;
}
.text-secondary {
    color: #98c1d9;
}
.text-tertiary {
    color: #ee6c4d;
}

```

- El folder de stories se toman los componentes deseados.

2. React-Pro\12-storybook\src\stories\MyLabel.stories.tsx
    - Acá se define la historia del componente, o la configuración visual cuando aparezca en storybook en el browser.
    - Apartados:
        1. meta:  información que se tiene de la página, la cual aparece en el menú, y cierta info que se puede indicar para rijan a la hora de tener el editor visual.
            - Con el código colocado va a inferir la información del compente especificado, tal como sus properties y cómo lucen.
            - Con el campo de title se pueden ir creando además los folders y no solo el nombre del archivo:
                - UI/labels/MyLabel
        2. story: se refiere a las secciones como Primary, Secondary, Large, Small que se pueden ver con los ejemplos que trae por defecto. Se le indica cómo se desea que funcione, qué info se desea mostrar por defecto.
    
__MyLabel.stories.tsx__
``` tsx
import { Meta, StoryObj } from "@storybook/react";
import { MyLabel } from "../components/MyLabel";

const meta = {
    title: 'MyLabel',
    component: MyLabel,
    parameters: {
        layout: 'centered',
    }
} satisfies Meta<typeof MyLabel>

export default meta;
type Story = StoryObj<typeof meta>

export const Basic: Story = {};
```

## 3. Añadir props y controles
1. Se definen las props en MyLabel.tsx

```tsx
import './MyLabel.css'

interface Props {
    label: string;
    size?: "normal" | "h1" | "h2" | "h3";
}

export const MyLabel = ({label, size = 'normal'}: Props) => {
  return (
    <div className={`${size}`}>{label}</div>
  )
}
```

2. Ajustar MyLabel.stories.tsx
    - Se aprovecha además para colocar las tags en meta, las cuales ayudan a crear la documentación de forma automática del componente.

``` tsx
import { Meta, StoryObj } from "@storybook/react";
import { MyLabel } from "../components/MyLabel";

const meta = {
    title: 'MyLabel',
    component: MyLabel,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    }
} satisfies Meta<typeof MyLabel>

export default meta;
type Story = StoryObj<typeof meta>

export const Basic: Story = {
    args: {
        label: 'Basic Label'
    }
};
```

## 4. Documentar automáticamente las descripciones
- La documentación se coloca en la interfaz de ts que se creó para el componente.

```tsx
import './MyLabel.css'

interface Props {
    /**
     * Text to display
    */
    label: string;

    /**
     * Label size
    */
    size?: "normal" | "h1" | "h2" | "h3";
}

export const MyLabel = ({label, size = 'normal'}: Props) => {
  return (
    <div className={`${size}`}>{label}</div>
  )
}
```

- Storybook infiere qué tipo es el adecuado para cada prop (usar radio buttons para enums, etc), pero se puede forzar con la propiedad argTypes en meta.
    - Si se deja el cursor sobre esta propiedad aparece un link de control annotations que lleva a la documentación de las posibles opciones.

```tsx
import { Meta, StoryObj } from "@storybook/react";
import { MyLabel } from "../components/MyLabel";

const meta = {
    title: 'MyLabel',
    component: MyLabel,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        size: { control: 'inline-radio' }
    }
} satisfies Meta<typeof MyLabel>

export default meta;
type Story = StoryObj<typeof meta>

export const Basic: Story = {
    args: {
        label: 'Basic Label'
    }
};
```

- Se pueden agregar más historias al componente.

```tsx
import { Meta, StoryObj } from "@storybook/react";
import { MyLabel } from "../components/MyLabel";

const meta = {
    title: 'UI/Labels/MyLabel',
    component: MyLabel,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        size: { control: 'inline-radio' },
        fontColor: { control: 'color' }
    }
} satisfies Meta<typeof MyLabel>

export default meta;
type Story = StoryObj<typeof meta>

export const Basic: Story = {
    args: {
        label: 'Basic Label'
    }
};

export const AllCaps: Story = {
    args: {
        label: 'All Caps Label',
        allCaps: true
    }
}

export const Secondary: Story = {
    args: {
        label: 'Secondary Label',
        color: 'text-secondary'
    }
}

export const CustomColor: Story = {
    args: {
        label: 'Custom Color Label',
        fontColor: 'green'
    }
}
```

## 5. Desplegar Storybook

1. Generar carpeta storybook-static
    - Esta es la carpeta que se sube por ejemplo a Github Pages o Netlify

``` bash
npm run build-storybook
```

### Github Pages
https://cursos.devtalles.com/courses/take/react-pro/lessons/35269791-github-y-github-pages
- Busca por defecto la carpeta docs
    1. Renombrar storybook-static por docs

### Chromatic
https://cursos.devtalles.com/courses/take/react-pro/lessons/35269814-bonus-chromatic

# Sección 13. NPM Empaquetamiento y publicación
## Temas
1. Preparación de package.json
2. Preparación de tsconfig.json
3. Limpieza de directorios
4. Copiar recursos estáticos
5. Subida y publicación a NPM
6. Versionamiento semántico
7. Versionamiento en GitHub
8. Prueba en otro proyecto
9. Build de producción
10. Actualización de dependencias.