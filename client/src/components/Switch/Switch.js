import { useState } from 'react';

export default function Switch({
    id,
    label,
    checked: initChecked = false,
    invert = false,
    onChange: _onChange = () => {}
}={}) {
    const [checked, setChecked] = useState(initChecked);
    const onChange = (e) => {
        setChecked(e.target.checked);
        _onChange(invert ? !e.target.checked : e.target.checked);
    }

    return (
        <div className="form-check form-switch">
            <input
                className="form-check-input"
                type="checkbox"
                id={id}
                checked={checked}
                onChange={onChange}
            />
            <label className="form-check-label" htmlFor={id}>{label}</label>
        </div>
    );
}