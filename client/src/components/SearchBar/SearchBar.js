import { useState } from "react"

export function SearchBar({
    onChange = () => {},
    type: initType = "title"
}={}) {
    const [text, _setText] = useState("");
    const [type, _setType] = useState(initType);

    function setText(text) {
        _setText(text);
        onChange(text, type);
    }

    function setType(type) {
        _setType(type);
        onChange(text, type);
    }

    return (
        <div className="input-group mb-3">
            <input 
                type="text" 
                className="form-control" 
                placeholder="Search..." 
                aria-label="Search" 
                aria-describedby="basic-addon2"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <select 
                className="form-select" 
                id="inputGroupSelect01"
                value={type}
                onChange={(e) => setType(e.target.value)}
            >
                <option value="title">Title</option>
            </select>
        </div>
    )
}