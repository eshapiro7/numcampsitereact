import React, { Component } from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import Directory from './DirectoryComponent';
import { CAMPSITES } from '../shared/campsites';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      campsites: CAMPSITES
      selectedCampsite: null
    };
  }

  onCampsiteSelect(campsite) {
    this.setState({selectedCampsite: campsite});
}


  render() {
      return (
          <div>
              <Navbar dark color="primary">
              <div className="container">
                  <NavbarBrand href="/">NuCamp</NavbarBrand>
              </div>
              </Navbar>
              <Directory campsites={this.state.campsites} />
              <CampsiteInfo campsite={this.state.selectedCampsite}></CampsiteInfo>
          </div>
      );
  }
}

export default Main;
