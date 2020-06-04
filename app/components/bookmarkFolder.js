import React, { Component } from 'react';

class BookmarkFolder extends Component {
    
    async setBookmark() {
        const selectedOption = document.getElementById("newBookmark").value;
        browser.storage.local.set({"bookmarkId": selectedOption});
        window.location.reload();
    }
    render() {
        var options = [];
        var options = this.props.folders.map((e) => {
            return (
                <option value={e.id}>{e.title}</option>
            );
        });
        return(
            <div>
                <h3>Selected Bookmark Folder / <em>Carpeta de marcadores seleccionada</em></h3> <em>{this.props.bookmark.title}</em>
                <h3> Select a new Bookmark Folder / <em>Selecciona una nueva carpeta de marcadores</em></h3>
                <select id="newBookmark" >
                    {options}
                </select>

                <button onClick={this.setBookmark}>Update / <em>Actualizar</em></button>
            </div>
        );
    }
}

module.exports = BookmarkFolder;