import "src/pages/Board/Board.css";
import Header from "src/components/Header/Header";


function Board() {
    return (
        <div>
            <div>
                <Header/>
            </div>
            <div className="container-sm mx-auto p-3">
                <h1>Welcome Team Purple, This is CIT412 Final Project Front-end</h1>
            </div>
        </div>
    )
}

export default Board;