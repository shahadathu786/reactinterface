import React, {Component} from 'react';
import '../css/App.css';

import AddAppointments from './AddAppointments';
import SearchAppointments from './SearchAppointments';
import ListAppointments from './ListAppointments';
import { without, findIndex } from 'lodash';

class App extends Component {

  constructor() {
    super();
    this.state = {
      myAppoints: [],
      formDisplay: false,
      orderBy: 'petName',
      orderDir: 'asc',
      queryText: '',
      lastIndex: 1
    };
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.searchApts = this.searchApts.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }
  toggleForm() {
    this.setState({
      formDisplay: !this.state.formDisplay
    });
  }

  searchApts(query) {
    this.setState({queryText: query});
  }

  changeOrder(order, dir) {
    this.setState({
      orderBy: order,
      orderDir: dir
    });
  }

  updateInfo (name, value, id) {
    let tempApts = this.state.myAppoints;
    let aptIndex = findIndex(this.state.myAppoints, {
      aptId: id
    });
    tempApts[aptIndex][name] = value;
    this.setState({
      myAppoints: tempApts
    })
  }

  addAppointment(apt) {
    let tempApts = this.state.myAppoints;
    apt.aptId = this.state.lastIndex;
    tempApts.unshift(apt); //push date from to form
    this.setState({
      myAppoints: tempApts,
      lastIndex: this.state.lastIndex +1
    });
  }

  deleteAppointment(apt) {
    let temApts = this.state.myAppoints;
    temApts = without(temApts, apt);
    this.setState({
      myAppoints: temApts
    })
  }

  componentDidMount() {
    fetch('./data.json')
      .then(response => response.json())
      .then(result => {
        const apts = result.map(item => {
          item.aptId = this.state.lastIndex;
          this.setState({lastIndex: this.state.lastIndex + 1})
          return item;
        });
        this.setState({
          myAppoints: apts
        });
      });
  }
  render() {
    // const listItems = this.state.myAppoints.map(item => (
    // <div>
    //   <div>
    //     {item.petName}
    //   </div>
    //   <div>
    //     {item.ownerName}
    //   </div>
    // </div>
    // ));

    let order;
    let filteredApts = this.state.myAppoints;
    if(this.state.orderDir === 'asc') {
      order = 1;
    } else {
      order = -1;
    }

    filteredApts = filteredApts.sort((a,b) => {
      if(a[this.state.orderBy].toLowerCase() <
        b[this.state.orderBy].toLowerCase()
      ) {
        return -1 * order;
      } else {
        return 1 * order;
      }
    }).filter(eachItem => {
      return (
        eachItem['petName']
        .toLowerCase()
        .includes(this.state.queryText.toLowerCase()) ||
        eachItem['ownerName']
        .toLowerCase()
        .includes(this.state.queryText.toLowerCase()) ||
        eachItem['aptNotes']
        .toLowerCase()
        .includes(this.state.queryText.toLowerCase())
      )
    });
    

    return (
      <main className="page bg-white" id="petratings">
      <div className="container">
        <div className="row">
          <div className="col-md-12 bg-white">
            <div className="container">
              {/* {listItems} */}
              <AddAppointments
                formDisplay={this.state.formDisplay}
                toggleForm={this.toggleForm}
                addAppointment={this.addAppointment}
              />
              <SearchAppointments 
              orderBy={this.state.orderBy}
              orderDir={this.state.orderDir}
              changeOrder={this.changeOrder}
              searchApts={this.searchApts}
              />
              <ListAppointments
              //  appointments={this.state.myAppoints} 
              appointments={filteredApts} 
               deleteAppointment={this.deleteAppointment} 
               updateInfo={this.updateInfo}
               />
            </div>
          </div>
        </div>
      </div>
    </main>
    );
  }
  
}

export default App;
