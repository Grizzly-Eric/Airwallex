import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import "../sass/main.scss";

class Main extends Component {

    constructor(props){
        super(props);
        this.state = {
            formShow:false
        };
        this.openForm = this.openForm.bind(this)
        this.closeForm = this.closeForm.bind(this)

    }

    openForm(){
        this.setState({
            formShow:true
        })
    }

    closeForm(){
        this.setState({
            formShow:false
        })
    }

    render() {
        return ( 
            <div className="main">
                <div className="header">
                    <h1>BROCCOLI & CO.</h1>                
                </div>
                <div className="content">
                    <div className="center_box">
                        <h2>A better way<br/>to enjoy every day.</h2>
                        <p>Be the first to know when we launch.</p>
                        <a className="btn" onClick={this.openForm}>Request a invite</a>
                    </div>
                </div>
                <div className="footer">
                    <p>Made with ❤ in Melbourne</p>
                </div>

                {
                    this.state.formShow?<Form closeForm={this.closeForm}></Form>:""
                }
                
            </div>
        )
    }
}

class Form extends Component {

    constructor(props){
        super(props)
        this.state={
            name:"",
            email:"",
            email2:"",
            error:"",
            loading:false,
            result:""
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(event){

        let _this = this
        
        event.preventDefault();

        if (this.state.email !== this.state.email2 || !this.state.email) {
            this.setState({
                error:"Something wrong about email!"
            })
            return
        }
        if (!this.state.name) {
            this.setState({
                error:"Name is empty!"
            })
            return
        }

        this.setState({
            loading:true,
            error:""
        })
        // check 
        ajax({
            url : "https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth",
            type : "POST",
            async : true,
            data : { 
                name : this.state.name,
                email : this.state.email
            },
            success : function(data){
                _this.setState({
                    result:true,
                    loading:false
                })
            },
            error : function(data){
                _this.setState({
                    error:JSON.parse(data.responseText).errorMessage||"something wrong",
                    loading:false
                })
            }

        })
    }

    nameHandle(e){
        this.setState({
            name:e.target.value
        })
    }
    emailHandle(e){
        this.setState({
            email:e.target.value
        })
    }
    confirmHandle(e){
        this.setState({
            email2:e.target.value
        })
    }
    sendText(boo){
        if (boo) {
            return "Sending,please wait..."
        }else{
            return "Send"
        }
    }
    sendClass(boo){
        if (boo) {
            return "sending"
        }else{
            return "send"
        }
    }
    closeForm(e){
        if (e.target.id == "bg") {
            this.props.closeForm()            
        }
    }

    render(){
        
        return(
            <div className="form_bg" onClick={this.closeForm.bind(this)} id="bg">
                {
                    !this.state.result?
                    <form onSubmit={this.handleSubmit} className="form_box">
                        <h2>Request an invite</h2>
                        <hr/>
                        <input type="text" value={this.state.name} onChange={this.nameHandle.bind(this)} placeholder="Full Name"></input>
                        <input type="email" value={this.state.email} onChange={this.emailHandle.bind(this)} placeholder="Email"></input>
                        <input type="email" value={this.state.email2} onChange={this.confirmHandle.bind(this)} placeholder="Confirm Email"></input>
                        <br/>
                        <input type="submit" className={this.sendClass(this.loading)+" btn"} value={this.sendText(this.state.loading)} />
                        {
                            this.state.error?<p>{this.state.error}</p>:""
                        }
                    </form>:<div className="form_box">
                        <h2>Request an invite</h2>                      
                        <hr/>
                        <p>You will be one of the first to experience Broccoli & Co. when we launch.</p>
                        <a className="btn" onClick={this.props.closeForm}>OK</a>
                    </div>
                }
            </div>
        )
    }

}

// ajax
function ajax(options){
    var xhr = null;
    var params = JSON.stringify(options.data);
    
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest()
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    if(options.type == "GET"){
        xhr.open(options.type,options.url + "?"+ params,options.async);
        xhr.send(null)
    } else if(options.type == "POST"){
        xhr.open(options.type,options.url,options.async);
        xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(params);
    }
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            options.success(xhr.responseText);
        }else{
            options.error(xhr);
        }
    }
 
}





ReactDOM.render(<Main />, document.getElementById('react-app'));