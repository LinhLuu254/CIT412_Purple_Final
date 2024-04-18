import { useState } from "react"

export function SearchBar({
    type: initType = "title",
    search = () => {},
    disabled = false
}={}) {
    const [text, setText] = useState("");
    const [type, setType] = useState(initType);

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

            <button
                className="btn-primary"
                onClick={() => search(text, type)}
                disabled={disabled}
            >
                Search
            </button>
        </div>
    )
}