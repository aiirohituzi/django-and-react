import React from 'react';
import axios from 'axios';

import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

class UploadPost extends React.Component {
    constructor(props) {
        super(props);

        
        this.upload = this.upload.bind(this);
    }

    upload = async () => {
        var loginId = sessionStorage.getItem('loginId');
        var loginPw = sessionStorage.getItem('loginPw');

        var title = document.getElementById('formControlsTitle').value
        var content = document.getElementById('formControlsContent').value

        await axios.post('http://127.0.0.1:8000/upload/', {
            user: loginId,
            password: loginPw,
            title: title,
            content: content,
        })
        .then(function (response) {
            // console.log(response.data);
            if(response.data == 'True'){
                // console.log(response.data);
                alert('Upload success');
            } else {
                console.log('Error');
                alert('Error');
            }
        })
        .catch(function (error) {
            console.log(error);
        });

        this.forceUpdate();
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={12} sm={8} md={8}>
                        <FormGroup controlId="formControlsTitle">
                            <ControlLabel>Title</ControlLabel>
                            <FormControl type="text" placeholder="Enter title" />
                        </FormGroup>
                        <FormGroup controlId="formControlsContent">
                            <ControlLabel>Content</ControlLabel>
                            <FormControl componentClass="textarea" placeholder="Content" style={{ height: 200 }} />
                        </FormGroup>
                        <Button bsClass="btn btn-primary pull-right" onClick={ this.upload.bind(this) }>Upload</Button>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default UploadPost;