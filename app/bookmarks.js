import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class ListView extends Component {
    render() {
        var bks = this.props.bookmarks;
        var items = (bks.map(function (b, i) {
            console.log('item', b);
            if (b.url == undefined) {
                return (<div key={b.id} key={b.id} className='one'>
                    <Folder title={b.title} id={b.id} faviconURL={b.faviconURL}/>
                </div>);
            } else {
                return (<div key={b.id} key={b.id} className='one'>
                    <Bookmark title={b.title} url={"/"+b.id} faviconURL={b.faviconURL}/>
                </div>);
            }
        }));
        return (items);
    }
}

class Bookmark extends Component {
    render() {
        return (
            <a href={this.props.url} title={this.props.title}>

                <Favicon url={this.props.url} faviconURL={this.props.faviconURL}/>
                <p className='text'>{this.props.title}</p>
            </a>
        );
    }
}

class Folder extends Component {
    render() {
        return (
            <a onClick={() => loadFolder(this.props.id)} title={this.props.title} id={this.props.id}>

                <Favicon url={"images/folder.png"} faviconURL={"images/folder.png"}/>
                <p className='text'>{this.props.title}</p>
            </a>
        );
    }
}

class Favicon extends Component {
    render() {
        var url = this.props.faviconURL;
        return (
            <span>
                <img src={url} id={url} width="128" height="128" className="thumbnail" />
            </span>
        );
    }
}

class Home extends Component {
    render() {
        return (
            <button onClick={home}>
                Home
            </button>
        );
    }
}

function getFlatBookmarks(bookmarkTree, faviconServerURL) {
    var bookmarks = getAllBookmarks(bookmarkTree, faviconServerURL);
    var flattened_bookmarks = flatten(bookmarks);
    return flattened_bookmarks;
}

function getGroupBookmarks(bookmarkTree, faviconServerURL) {
    var bookmarks = getFolderBookmarks(bookmarkTree, faviconServerURL);
    var flattened_bookmarks = flatten(bookmarks);
    return flattened_bookmarks;
}

function flatten(ary) {
    var ret = [];
    for (var i = 0; i < ary.length; i++) {
        if (Array.isArray(ary[i])) {
            ret = ret.concat(flatten(ary[i]));
        } else {
            ret.push(ary[i]);
        }
    }
    return ret;
}

async function loadFolder(id) {
    renderBookmarks(id);
}

function getAllBookmarks(bookmarkTree, faviconServerURL) {
    var bookmarks = [];
    console.log(bookmarkTree);
    for (var i = 0; i < bookmarkTree.length; i++) {
        var element = bookmarkTree[i];
        if ((element.url != undefined) && (element.url.startsWith("http"))) {
            element.faviconURL = faviconServerURL + "/icon?size=128&url=" + element.url;
            bookmarks.push(element);
        }
        else {
            if (element.children != undefined) {
                bookmarks.push(getAllBookmarks(element.children, faviconServerURL));
            }
        }
    }
    return bookmarks;
}

function getFolderBookmarks(bookmarkTree, faviconServerURL) {
    var bookmarks = [];
    var folder = bookmarkTree[0];
    console.log(folder.children);
    for (var i = 0; i < folder.children.length; i++) {
        var element = folder.children[i];
        element.faviconURL = faviconServerURL + "/icon?size=128&url=" + element.url;
        bookmarks.push(element);
    }
    return bookmarks;
}

function home() {
    renderBookmarks();
}

async function renderBookmarks(id) {
    const prefs = await browser.storage.local.get();
    var faviconServerURL = prefs.faviconServerURL;
    var bId = prefs.bookmarkId || "toolbar_____";
    var bId = id || bId;
    var bookmarkTree = await browser.bookmarks.getSubTree(bId);
    if (faviconServerURL === undefined) {
        faviconServerURL = "https://icon-fetcher-go.herokuapp.com"
    }
    var flattened_bookmarks = getGroupBookmarks(bookmarkTree, faviconServerURL);
    if (prefs.style != undefined) {
        ReactDOM.render(prefs.style, document.getElementById('style'));
    }
    console.log(flattened_bookmarks);
    ReactDOM.render(<ListView bookmarks={flattened_bookmarks} />, document.getElementById('app'));
    ReactDOM.render(<Home/>, document.getElementById('home'));
}
renderBookmarks();