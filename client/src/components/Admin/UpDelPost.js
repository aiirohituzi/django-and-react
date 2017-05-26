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
        this.updateToggle = this.updateToggle.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        
        const { postInfo, postCount } = nextProps;

        this.setState({
            postInfo,
            postCount
        })
    }

    close() {
        this.setState({
            showModal: false,
            update: false
        });
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

    update = async (state, postId, listId) => {
        this.updateToggle(state);
        if(state){            
            var title = document.getElementById('formTitle').value;
            var content = document.getElementById('formContent').value;
            var loginId = sessionStorage.getItem('loginId');
            var loginPw = sessionStorage.getItem('loginPw');
            var postInfo = this.state.postInfo;
            var clickedTitle = this.state.clickedTitle;
            var clickedContent = this.state.clickedContent;

            // console.log(title);
            // console.log(content);
            // console.log(postId);

            await axios.post('http://127.0.0.1:8000/update/', {
                postId: postId,
                title: title,
                content: content,
                user: loginId,
                password: loginPw
            })
            .then(function (response) {
                if(response.data == 'True'){
                    postInfo[listId].title = title;
                    postInfo[listId].content = content;
                    clickedTitle = title;
                    clickedContent = content;
                } else {
                    console.log('Error');
                    alert('Error');
                }
            })
            .catch(function (error) {
                console.log(error);
            });

            this.setState({
                postInfo: postInfo,
                clickedTitle: clickedTitle,
                clickedContent: clickedContent
            });
        }

        this.updateToggle(state);
        this.forceUpdate();
    }

    updateToggle(state) {
        this.setState({
            update: !state
        });
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

        const modalInstance = [];
        modalInstance.push(
                <Modal.Header closeButton>
                    <Modal.Title>
                        <TitleForm
                            update={ update }
                            title={ clickedTitle }
                        />
                    </Modal.Title>
                </Modal.Header>
        );
        modalInstance.push(
                <Modal.Body>
                    <ContentForm
                        update={ update }
                        content={ clickedContent }
                    />
                </Modal.Body>
        );
        if(!update){
            modalInstance.push(
                <Modal.Footer>
                    <Button bsClass="btn" onClick={ this.close }>닫기</Button>
                    <Button bsClass="btn" onClick={ this.update.bind(this, update, clickedId, clickedListId) }>수정</Button>
                    <Button bsClass="btn btn-danger" onClick={ this.delete.bind(this, clickedId, clickedListId) }>삭제</Button>
                </Modal.Footer>
            );
        } else {
            modalInstance.push(
                <Modal.Footer>
                    <Button bsClass="btn" onClick={ this.close }>닫기</Button>
                    <Button bsClass="btn" onClick={ this.update.bind(this, update, clickedId, clickedListId) }>수정</Button>
                    <Button bsClass="btn" onClick={ this.updateToggle.bind(this, update) }>취소</Button>
                </Modal.Footer>
            );
        }
 
        // show nothing when data is not loaded
        if(postInfo === null) return null;
 
        return (
            <ListGroup>
                { listInstance }
                <Modal show={ this.state.showModal } onHide={ this.close }>
                    { modalInstance }
                </Modal>
            </ListGroup>
        );
    }
}
 
export default UpDelPost;