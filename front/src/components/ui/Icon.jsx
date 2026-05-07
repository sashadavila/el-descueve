export default function Icon({ name, className = "", fill = false, weight = 400, size = 24 }) {
    // Construir las variaciones de configuración
    const fontVariationSettings = `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`

    return (
        <span
            className={`material-symbols-outlined ${className}`}
            style={{ fontVariationSettings }}
        >
            {name}
        </span>
    )
}