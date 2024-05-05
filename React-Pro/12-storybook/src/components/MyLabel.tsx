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

    /**
     * Label is capitalized
    */
    allCaps?: boolean;

    /**
     * Label color
    */
    color?: "text-primary" | "text-secondary" | "text-tertiary";

    /**
     * Font color
    */
    fontColor?: string;
}

export const MyLabel = ({ label, size = 'normal', allCaps = false, color = "text-primary", fontColor = 'white'  }: Props) => {
    return (
        <div className={`${size} ${color}`} style={{color: fontColor}}>{allCaps ? label.toUpperCase() : label}</div>
    )
}