import React, {Component} from 'react';
import AppHeader from '../app-header/app-header';
import SearchPanel from '../search-panel/search-panel';
import PostStatusFilter from '../post-status-filter/post-status-filter';
import PostList from '../post-list/post-list';
import PostAddForm from '../post-add-form/post-add-form';
import nextId from "react-id-generator";

import './app.css'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [
                {label: 'going to learn React', important: false, like: false, id: nextId()},
                {label: "that's so good", important: false, like: false, id: nextId()},
                {label: 'starting to understand smth', important: false, like: false, id: nextId()}
            ], 
            term: '',
            filter: 'all'
        }
    }

    deleteItem = (id) => {
        this.setState(({data}) => {
            const index = data.findIndex(elem => elem.id === id);
            const before = data.slice(0, index),
                  after = data.slice(index + 1);
            const newArr = [...before, ...after];
            // for more clear code better not to declare before - after:
            // const newArr = [...data.slice(0, index), ...data.slice(index + 1)];
            return {
                data : newArr
            }
        });
    }

    addItem = (postText) => {
        const newItem = {
            label: postText,
            important: false,
            id: nextId()
        }
        this.setState(({data}) => {
            const newArr = [...data, newItem];
            return {
                data: newArr
            }
        })
    }

    commonToggle = ({id, isImportant = false, isLike = false}) => {
        this.setState(({data}) => {
            const index = data.findIndex(elem => elem.id === id);
     
            const old = data[index];
            const newItem = {...old};
     
            if (isImportant) {
                newItem.important = !old.important;
            }
     
            if (isLike) {
                newItem.like = !old.like;
            }
     
            const newArr = [...data.slice(0, index), newItem, ...data.slice(index + 1)];
     
            return {
                data: newArr
            }
        });
    }
     
    onToggleImportant = id => {
        this.commonToggle({id, isImportant: true});
    }
     
    onToggleLiked = id => {
        this.commonToggle({id, isLike: true})
    }

    searchPost = (items, term) => {
        if (term.length === 0) {
            return items
        }

        return items.filter( (item) => {
            return item.label.indexOf(term) > -1
        });
    }

    filterPosts = (items, filter) => {
        if (filter === 'like') {
            return items.filter(item => item.like)
        } else {
            return items
        }
    }

    onUpdateSearch = (term) => {
        this.setState({term})
    }

    onFilterSelect = (filter) => {
        this.setState({filter})
    }

    render() {
        const liked = this.state.data.filter(item => item.like).length,
              allPosts = this.state.data.length;
        const {data, term, filter} = this.state,
              visiblePosts = this.filterPosts(this.searchPost(data, term), filter);
        return (
            <div className="app">
                <AppHeader
                    liked={liked}
                    allPosts={allPosts}/>
                <div className="search-panel d-flex">
                    <SearchPanel 
                        onUpdateSearch={this.onUpdateSearch}/>
                    <PostStatusFilter 
                        filter={filter}
                        onFilterSelect={this.onFilterSelect}
                        />
                </div>
                <PostList 
                    posts={visiblePosts}
                    onDelete={this.deleteItem}
                    onToggleImportant={this.onToggleImportant}
                    onToggleLiked={this.onToggleLiked}/>
                <PostAddForm 
                    onAdd={this.addItem}/>
            </div>
        )
    }
}