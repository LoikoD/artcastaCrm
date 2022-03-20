import React,{Component} from 'react';
import {Table} from 'react-bootstrap';

export class Company extends Component{

    constructor(props){
        super(props);
        this.state={comps:[]}
    }

    refreshList(){
        fetch(process.env.REACT_APP_ARTCASTA_API+'table/company')
        .then(response=>response.json())
        .then(data=>{
            this.setState({comps:data});
        });
    }

    componentDidMount(){
        this.refreshList();
    }

    componentDidUpdate(){
        this.refreshList();
    }

    render(){
        const {comps}=this.state;
        return(
            <div>
                <Table className='mt-4' striped bordered hover size='sm'>
                    <thead>
                        <tr>
                            <th>CompanyId</th>
                            <th>CompanyNameShort</th>
                            <th>CompanyNameFull</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comps.map(comp=>
                            <tr key={comp.CompanyId}>
                                <td>{comp.CompanyId}</td>
                                <td>{comp.CompanyNameShort}</td>
                                <td>{comp.CompanyNameFull}</td>
                                <td>Edit / Delete</td>
                            </tr>)}
                    </tbody>
                </Table>
            </div>
        )
    }
}