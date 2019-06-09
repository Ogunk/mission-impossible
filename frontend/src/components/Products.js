import React, {Component} from 'react';

class Products extends Component {

    // URL for the 2 endpoint we got, one to get a product by it's ID and one from his commercial name (Not Working ATM)
    GET_PRODUCT_BY_ID_URL = 'http://localhost:3000/product/';
    GET_PRODUCT_BY_NAME = 'http://localhost:3000/productByName/';

    constructor(props){
        super(props);
        this.state = {
            produit: {}
        };
    };

    //Function being called when the user types in the input field
    //Getting the value and passing it to the 'changeUrl' function
    handleChange(e){
        const url = e.target.value;
        this.changeUrl(url);
    };

    //Function being called by 'handleChange'
    //Getting the value from the input field and check his type
    //According to the type fetch one of the url
    changeUrl(produit){
        var url = '';
        if(parseInt(produit)) {
             url = this.GET_PRODUCT_BY_ID_URL + produit;
        }
        else{
            url = this.GET_PRODUCT_BY_NAME + produit;
        }

        //Passing the fetched JSON Object to our local 'produit' Object
        //if error show in the console
        fetch(url)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    produit: res
                });
            })
            .catch((error => {
                console.error(error);
            }));
    };

    //Returning the field being displayed
    //If and object has been fetched show his details
    //Else show nothing
    render() {
        return (
            <div>
                <label>Id du produit à chercher : </label><input onChange={this.handleChange.bind(this)}/>
                <div>
                    <p><strong>Id du produit : {this.state.produit.IDPRODUIT} </strong></p>
                    <p>Type : {this.state.produit.TYPE}</p>
                    <p>Référence : {this.state.produit.REFERENCE}</p>
                    <p>Catégorie : {this.state.produit.CATEGORIE}</p>
                    <p>Description du produit : {this.state.produit.DESCRIPTION}</p>
                </div>
            </div>
        );
    }
}

export default Products;