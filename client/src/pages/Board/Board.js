import BookGallery from "src/components/BookGallery/BookGallery";
import 'src/pages/Board/Board.css'

function Board() {
    return (
        <div className="container-sm mx-auto p-3" id="board">
            <h2>Book's Gallery</h2>
            <BookGallery />
        </div>
    )
}

export default Board;