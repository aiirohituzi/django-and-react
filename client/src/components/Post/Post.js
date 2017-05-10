import React from 'react';

import { Grid, Row, Col, Thumbnail, Button, Modal } from 'react-bootstrap';
// import Grid from 'react-bootstrap/lib/Grid';
// import Row from 'react-bootstrap/lib/Row';
// import Col from 'react-bootstrap/lib/Col';
// import Thumbnail from 'react-bootstrap/lib/Thumbnail';
// import Button from 'react-bootstrap/lib/Button';

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postInfo: null,
            postCount: null,
            showModal: false,
            clickedId: 1,
        }

        this.close = this.close.bind(this);
        //this.detail = this.detail.bind(this);
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

    detail(idx) {
        this.setState({
            showModal: true,
            clickedId: idx,
        });
        console.log('clicked ' + idx);
        console.log(this.state.clickedId);
    }
    
    render() {
        const postInfo = this.state.postInfo;
        const postCount = this.state.postCount;
        const clickedId = this.state.clickedId;

        const thumbnailInstance = [];
        for(var i=0; i<postCount; i++) {
            if(postInfo[i] !== undefined){
                // console.log('확인된 포스트 id : ' + postInfo[i].id)
                // console.log(thumbnailInstance)
                thumbnailInstance.push(
                    <Col xs={12} sm={6} md={4} key={postInfo[i].id}>
                        <Thumbnail>
                            <h3>{postInfo[i].title}</h3>
                            <p>{postInfo[i].content}</p>
                            <p>
                            <Button bsStyle="primary" onClick={ this.detail.bind(this, postInfo[i].id) }>Button</Button>&nbsp;
                            <Button bsStyle="default">Button</Button>
                            </p>
                        </Thumbnail>
                    </Col>
                );
            }
        }

        const modalInstance = (
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
 
        // show nothing when data is not loaded
        if(postInfo === null) return null;
 
        return (
            <div>
                <Grid>
                    <Row>
                        {thumbnailInstance}
                        {modalInstance}
                    </Row>
                </Grid>
            </div>
        );
    }
}
 
export default Post;