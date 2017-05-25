import React from 'react';
import axios from 'axios';

import TitleForm from './TitleForm';
import ContentForm from './ContentForm';

import * as service from '../../services/post';

import { ListGroup, ListGroupItem, Button, Modal } from 'react-bootstrap';

class UpDelPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postInfo: null,
            postCount: null,
            showModal: false,
            clickedId: null,
            clickedTitle: null,
            clickedContent: null,
            clickedListId: null,
            update: false,
        }

        this.close = this.close.bind(this);
        this.detail = this.detail.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        
        const { postInfo, postCount } = nextProps;

        this.setState({
            postInfo,
            postCount
        })
    }

    close() {
        this.setState({ showModal: false });
    }

    detail = async (id, title, content, listId) => {
        await this.setState({
            clickedId: id,
            clickedTitle: title,
            clickedContent: content,
            clickedListId: listId
        });
        this.modalOpen();
        // console.log('clicked ' + idx);
    }

    update(state) {
        this.setState({
            update: !state
        });

        if(state){
            console.log(document.getElementById('formTitle').value);
            console.log(document.getElementById('formContent').value);
        }
    }

    delete = async (postId, listId) => {
        var loginId = sessionStorage.getItem('loginId');
        var loginPw = sessionStorage.getItem('loginPw');
        var postInfo = this.state.postInfo;

        await axios.post('http://127.0.0.1:8000/delete/', {
            postId: postId,
            user: loginId,
            password: loginPw
        })
        .then(function (response) {
            // console.log(response.data);
            if(response.data == 'True'){
                // console.log(response.data);
                // console.log(postInfo);
                delete postInfo[listId];
            } else {
                console.log('Error');
                alert('Error');
            }
        })
        .catch(function (error) {
            console.log(error);
        });
        // console.log(postInfo);
        
        this.close();
        this.forceUpdate();
    }

    modalOpen() {
        this.setState({
            showModal: true,
        });
        // console.log('clickId : ' + this.state.clickedId);
    }
    
    render() {
        const postInfo = this.state.postInfo;
        const postCount = this.state.postCount;

        const listInstance = [];
        for(var i=0; i<postCount; i++) {
            if(postInfo[i] !== undefined){
                listInstance.push(                    
                    <ListGroupItem key={ postInfo[i].id } onClick={ this.detail.bind(this, postInfo[i].id, postInfo[i].title, postInfo[i].content, i) }>
                        { postInfo[i].title }
                    </ListGroupItem>
                );
            }
        }

        const clickedId = this.state.clickedId;
        const clickedTitle = this.state.clickedTitle;
        const clickedContent = this.state.clickedContent;
        const clickedListId = this.state.clickedListId;

        const update = this.state.update;

        const modalInstance = (
            <Modal show={ this.state.showModal } onHide={ this.close }>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <TitleForm
                            update={ update }
                            title={ clickedTitle }
                        />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ContentForm
                        update={ update }
                        content={ clickedContent }
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button bsClass="btn" onClick={ this.close }>Close</Button>
                    <Button bsClass="btn" onClick={ this.update.bind(this, update) }>Update</Button>
                    <Button bsClass="btn btn-danger" onClick={ this.delete.bind(this, clickedId, clickedListId) }>Delete</Button>
                </Modal.Footer>
            </Modal>
        );
 
        // show nothing when data is not loaded
        if(postInfo === null) return null;
 
        return (
            <ListGroup>
                { listInstance }
                { modalInstance }
            </ListGroup>
        );
    }
}
 
export default UpDelPost;