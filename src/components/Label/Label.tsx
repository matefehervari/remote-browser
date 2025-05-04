import css from "./Label.module.css"

interface LabelProps {
    label: string;
    children?: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({
    label,
    children
}) => {
    return (
        <div className={css.labelDiv}>
            <div className={css.labelTextDiv}>
                <label>{label}</label>
            </div>
            {children}
        </div>
    )
}
