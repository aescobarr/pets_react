import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
/*import * as utils from './utils';*/

const NOSEL_ELEMENT = {nom: '-----', id: 999};


class AddButton extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = function(evt){
    const animalselector = this.props.animalselector;
    const propietarisanimals = this.props.propietarisanimals;    
    fetch('http://127.0.0.1:4000/propietaris_animals', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        propietari: animalselector.state.selectedPropietari,
        animal: animalselector.state.selectedAnimal,
      })
    }).then(results => {
      return results.json();
    }).then(data => {            
      propietarisanimals.setState({ propietaris_animals: data });      
    });
  };
  render(){
    return (      
       <button className="btn btn-primary" onClick={this.handleClick} type="button">Insert</button>       
    );
  }
}



class DeleteButton extends React.Component {
  constructor(props){
    super(props);    
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = function(evt){
    var id = this.props.id;
    var propietaristable = this.props.propietaristable;
    fetch('http://127.0.0.1:4000/propietaris_animals/' + id, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }      
    }).then(results => {
      return results.json();
    }).then(data => {            
      propietaristable.setState({ propietaris_animals: data });      
    });  
  };
  render(){
    return (      
       <button className="btn btn-danger" onClick={this.handleClick} type="button">Delete</button>       
    );
  }
}


class PropietarisTable extends React.Component {  
  constructor(props){
    super(props);
    this.state = {
      propietaris_animals : []
    };    
  }
  componentDidMount(){
    fetch('http://127.0.0.1:4000/propietaris_animals')
    .then(results => {
      return results.json();
    }).then(data => {      
      this.setState({ propietaris_animals: data });
    });
  }
  render(){      
    const data = this.state.propietaris_animals;
    const animalselector = this.props.animalselector
    return (
      <div>
        <AddButton animalselector={animalselector} propietarisanimals={this}/>      
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Propietari</th>
              <th>Animal</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
          {
            data.map((dat) => (
                <tr key={ dat.id }>
                  <td>{ dat.propietari.nom }</td>
                  <td>{ dat.animal.nom }</td>                
                  <td><DeleteButton id={dat.id} propietaristable={this}/></td>
                </tr>
              )
            )
          }
          </tbody>
        </table>
      </div>
    );
  }
}


class AnimalSelector extends React.Component {  
  constructor(props){
    super(props);
    this.state = {
      selectedGrup : 999,
      selectedAnimal: 999,
      selectedPropietari: 999,
    };
    this.handleGrupChange = this.handleGrupChange.bind(this);
    this.handleAnimalChange = this.handleAnimalChange.bind(this);    
    this.handlePropietariChange = this.handlePropietariChange.bind(this);    
  }
  handleGrupChange = function(evt){
      var value = Number.parseInt(evt.target.value);
      this.setState({ selectedGrup: value, selectedAnimal: 999 });
  };    
  handleAnimalChange = function(evt){
    this.setState({ selectedAnimal: Number.parseInt(evt.target.value) });
  };  
  handlePropietariChange = function(evt){
    this.setState({ selectedPropietari: Number.parseInt(evt.target.value) });
  }
  render(){      
    return (
      <div>
        <div>
          <PropietariDropDown handlePropietariChange={this.handlePropietariChange}/>
          <GrupDropdown selectedElement={this.state.selectedGrup} handleGrupChange={this.handleGrupChange} />
          <AnimalDropdown selectedGrup={this.state.selectedGrup} selectedAnimal={this.state.selectedAnimal} handleAnimalChange={this.handleAnimalChange} />          
        </div>
        <div>
          <PropietarisTable animalselector={this}/>
        </div>
      </div>
    );
  }  
}

class AnimalElement extends React.Component {
  render() {
    const animal = this.props.animal;        
    return (      
      <option value={ animal.id }>{ animal.nom }</option>        
    );    
  }
}

class AnimalDropdown extends React.Component {
  constructor(){
    super();
    this.state = {
      animals: []
    };
  }  
  componentDidMount(){
    fetch('http://127.0.0.1:4000/animals')
    .then(results => {
      return results.json();
    }).then(data => {      
      this.setState({ animals: data });
    });
  }
  render() {
    const animals = this.state.animals;
    const selected_animal = this.props.selectedAnimal;
    const selected_group = this.props.selectedGrup;
    const elements = [];    
    elements.push(<AnimalElement key={NOSEL_ELEMENT.id} animal={NOSEL_ELEMENT}/>);
    animals.forEach((animal) => {            
      if(animal.grupId === selected_group || animal.grupId === 999){
        elements.push(<AnimalElement key={animal.id} animal={animal}/>);
      }
    });
    return (
      <select value={selected_animal} onChange={this.props.handleAnimalChange}>{elements}</select>
    );    
  }
}

class PropietariElement extends React.Component {
  render() {
    const propietari = this.props.propietari;
    return (      
      <option value={ propietari.id }>{ propietari.nom }</option>
    );        
  } 
}

class PropietariDropDown extends React.Component {
  constructor(){
    super();
    this.state = {
      propietaris: []
    };
  }
  componentDidMount(){
    fetch('http://127.0.0.1:4000/propietaris')
    .then(results => {
      return results.json();
    }).then(data => {      
      this.setState({ propietaris: data });
    });
  }
  render() {
    const propietaris = this.state.propietaris;    
    const elements = [];    
    elements.push(<PropietariElement key={NOSEL_ELEMENT.id} propietari={NOSEL_ELEMENT}/>);
    propietaris.forEach((propietari) => {      
      elements.push(<PropietariElement key={propietari.id} propietari={propietari}/>);  
    });
    return (
      <select onChange={this.props.handlePropietariChange}>{elements}</select>
    );
  }
}

class GrupElement extends React.Component {
  render() {
    const grup = this.props.grup;    
    return (      
      <option value={ grup.id }>{ grup.nom }</option>
    );        
  }
}

class GrupDropdown extends React.Component {
  constructor(){
    super();
    this.state = {
      grups: []
    };
  }
  componentDidMount(){
    fetch('http://127.0.0.1:4000/grups')
    .then(results => {
      return results.json();
    }).then(data => {      
      this.setState({ grups: data });
    });
  }
  render() {
    const grups = this.state.grups;
    const selected = this.props.selectedElement;
    const elements = [];    
    elements.push(<GrupElement key={NOSEL_ELEMENT.id} grup={NOSEL_ELEMENT}/>);
    grups.forEach((grup) => {      
      elements.push(<GrupElement key={grup.id} grup={grup}/>);  
    });
    return (
      <select value={selected} onChange={this.props.handleGrupChange}>{elements}</select>
    );
  }
}

ReactDOM.render(<AnimalSelector />, document.getElementById('root'));