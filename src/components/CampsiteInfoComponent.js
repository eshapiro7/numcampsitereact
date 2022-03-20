import React, { Component } from 'react';
import { Card, CardImg, CardImgOverlay, CardTitle, CardBody, CardText, 
    Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, FormGroup, Label, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors} from 'react-redux-form';
import ModalBody from 'reactstrap/lib/ModalBody';

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

    handleSubmit =(values) => {
        alert('Current state is: ' + JSON.stringify(values));
        this.toggleModal();
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
                                        <Control.select model=".rating" name="rating" className="form-control" id="rating">
                                            <option>1</option> 
                                            <option>2</option> 
                                            <option>3</option> 
                                            <option>4</option> 
                                            <option>5</option> 
                                        </Control.select>
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="author">Your Name</Label>
                                    <Control.text model=".author" name="author" className="form-control" id="author" placeholder='Your Name'
                                    
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
                                        <Control.textarea model=".text" name="text" id="text"rows="6" className='form-control' /> 
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
            <CardImg width="100%" src={campsite.image} alt={campsite.name} />
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
                <Card>
                    <CardImg top src={campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </div>
        )

    }

    function RenderComments({comments}) {
        if (comments) {
            return (
                <div className="col-md-5 m-1">
                    <h4>Comments</h4>
                    {comments.map(comment => <div key={comment.id}>
                        <p>{comment.text}</p>
                        <p>-- {comment.author} {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p></div>)}
                        <CommentForm />
                </div>
            )
        } else {
            return(<div/>)
        }
    }
    function CampsiteInfo(props) {
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
                        <RenderComments comments={props.comments} />
                    </div>
                </div>
            );
        }
        return <div />;
    }
    
    export default CampsiteInfo;