import BookGallery from "src/components/BookGallery/BookGallery";
import "src/pages/Board/Board.css"

function Board() {
    return (
        <div className="container-sm mx-auto p-3">
            <h2>Gallery</h2>
            <BookGallery />
        </div>
    )
}

export default Board;