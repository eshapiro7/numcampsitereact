import React, { Component } from 'react';
import { Card, CardImg, CardImgOverlay, CardTitle, CardBody, CardText, 
    Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors} from 'react-redux-form';
import ModalBody from 'reactstrap/lib/ModalBody';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);
const validAuthor = () => /^[A-Za-z]$/;

class CommentForm extends Component {

    state={
        isModalOpen: false,
        touched: {author: false},
        
    };
    toggleModal=() => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    };

    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
    }
    render(){
        return(
            <>
                <Button outline onClick={this.toggleModal}>
                    <i className="fa fa-pencil fa-lg" /> Submit Comment</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                        <ModalBody>
                            <LocalForm onSubmit={(values)=>this.handleSubmit(values)}>
                                <div className='form-group'>
                                    <Label htmlFor="rating">Rating</Label>
                                        <Control.Select model=".rating" name="rating" className="form-control" id="rating">
                                            <option>1</option> 
                                            <option>2</option> 
                                            <option>3</option> 
                                            <option>4</option> 
                                            <option>5</option> 
                                        </Control.Select>
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="author">Your Name</Label>
                                    <Control.Text model=".author" name="author" className="form-control" id="author" placeholder='Your Name'
                                    
                                    validators={{
                                        required,
                                        validAuthor, 
                                        minLength: minLength(2),
                                        maxLength: maxLength(15)
                                    }}/>
                                     <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        component="div"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be at least 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                        
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="comment">Comment</Label>
                                        <Control.Textarea model=".text" name="text" id="text"rows="6" className='form-control' /> 
                                </div>
                                <div className="form-group">
                                    <Button type="submit" color="primary">
                                            Submit
                                    </Button>
                                </div>
                            </LocalForm>
                        </ModalBody>
                </Modal>
            </>
        );
    };
}

function RenderDirectoryItem({campsite, onClick}) {
    return (
        <Card onClick={() => onClick(campsite.id)}>
            <CardImg width="100%" top src={baseUrl + campsite.image} alt={campsite.name} />
            <CardImgOverlay>
                <CardTitle>{campsite.name}</CardTitle>
            </CardImgOverlay>
        </Card>
    );
}

function Directory(props) {

    const directory = props.campsites.map(campsite => {
        return (
            <div key={campsite.id} className="col-md-5 m-1">
                <RenderDirectoryItem campsite={campsite} onClick={props.onClick} />
            </div>
        );
    });

    return (
        <div className="container">
            <div className="row">
                {directory}
            </div>
        </div>
    );
}

export { Directory };

    function RenderCampsite({campsite}) {
        return(
            <div className="col-md-5 m-1">
                 <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                    <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
            </div>
        )

    }

    function RenderComments({comments, postComment, campsiteId}) {
        if (comments) {
            return (
                <div className="col-md-5 m-1">
                    <h4>Comments</h4>
                    <Stagger in>
                        {comments.map(comment => {
                            return (
                                <Fade in key={comment.id}>
                             <div>
                            <p>{comment.text}<br />
                                -- {comment.author} {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                            </p></div>
                            </Fade>
                            );
                            })}
                    </Stagger>
                    <CommentForm campsiteId={campsiteId} postComment={postComment} />
                </div>
            )
        } else {
            return(<div/>)
        }
    }
    function CampsiteInfo(props) {
        if (props.isLoading) {
            return (
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            );
        }
        if (props.errMess) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h4>{props.errMess}</h4>
                        </div>
                    </div>
                </div>
            );
        }
        if (props.campsite) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col">
                        <Breadcrumb>
                                <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                                <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                            </Breadcrumb>
                            <h2>{props.campsite.name}</h2>
                            <hr />
                        </div>
                    </div>
                    <div className="row">
                        <RenderCampsite campsite={props.campsite} />
                        <RenderComments 
                            comments={props.comments}
                            postComment={props.postComment}
                            campsiteId={props.campsite.id} 
                        />
                    </div>
                </div>
            );
        }
        return <div />;
    }
    
    export default CampsiteInfo;