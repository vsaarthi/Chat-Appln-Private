import React, { Component } from "react";
import { Select } from 'antd';
import 'antd/dist/antd.css';

const { Option } = Select;
const io = require('socket.io-client');
const socket = io();

class ChatBox extends Component {
  constructor() {
    super();
    this.state = { msg: "", chat: [], name: "",  list:[], sendid:'', myid:'' };
  }

  componentDidMount() {
    socket.on("chat message", ({ id,name, msg }) => {
      this.setState({ chat: [ { id,name, msg },...this.state.chat] });
    });
    socket.on('server message', (message) => {
      var people = JSON.parse(message);
      this.setState({ list : people , myid : socket.io.engine.id })
      })
    }

  onTextChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onMessageSubmit = () => {
    const { name, msg, sendid, myid } = this.state;
    socket.emit("chat message", { name, msg, sendid, myid});
    this.setState({ msg: "" });
  };

  selectReciever = (people) => {
    this.setState({ sendid : people})
  }

  render() {
    const { chat, list, myid } = this.state;
    return (
      <div style={{marginTop :'20px', marginLeft:'20px'}}>
        <span>Name : </span>
        <input name="name" onChange={e => this.onTextChange(e)} value={this.state.name} />
        <span style={{color : "red" }}> ( MyId: {myid} ) </span>
        <br/><br/>
        <span>Message : </span>
        <input placeholder="Type a msg" name="msg" onChange={e => this.onTextChange(e)} value={this.state.msg}/> 
        &ensp; &ensp;
        <Select onChange = {(value) => this.selectReciever(value)} placeholder= "Choose the Reciever" >
          {list.map((people) => (
          people!==socket.io.engine.id && <Option value= {people}>{people}</Option>
        ))}
        </Select>
        &ensp; &ensp;
        <button onClick={this.onMessageSubmit}>Send</button><br/><br/>
        <div> 
          {chat.map(({ id, name, msg }) => (
            <div><span style={{color : "red" }}>From : </span> {name}<span > ({id}) </span> : {msg}
            <br/><br/>
            </div>
          ))}
        </div>
      </div>
        );}
}

export default ChatBox;