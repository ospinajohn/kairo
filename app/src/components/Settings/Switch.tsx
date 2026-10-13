// ============================================================
// Kairo — Switch estilo iOS
// Fuente visual: docs/design.md §7.2
// ============================================================

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export function Switch({ checked, onChange, id, ariaLabel, disabled = false }: SwitchProps) {
  return (
    <button
      className='interactive-control'
      id={id}
      type='button'
      role='switch'
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 9999,
        background: disabled
          ? 'var(--track-faint)'
          : checked
            ? 'linear-gradient(135deg, #E5301A 0%, #FF7A3D 100%)'
            : 'var(--track)',
        position: 'relative',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: 2,
        flexShrink: 0,
        outline: 'none',
        opacity: disabled ? 0.4 : 1,
        transition: 'background 200ms ease, box-shadow 200ms ease',
        boxShadow: checked && !disabled ? '0 0 10px rgba(255, 75, 43, 0.35)' : 'none',
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 9999,
          backgroundColor: '#FFFFFF',
          transform: checked ? 'translateX(18px)' : 'translateX(0px)',
          transition: 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}
      />
    </button>
  );
}
