<script>
  import { setContext } from "svelte";
  import { ethers } from "ethers";
  import { abi } from "../abi";
  import {activeChat, chatHistory} from "../stores/store";
  let publicKey = ""
  let myUsername = ""
//myContract structure: {contract: "", publicKey: ""}
  let myContract = null;
  import ChatMessage from "./ChatMessage.svelte";
  import FriendList from "./FriendList.svelte";
  //import json file with demo data
  import demoChats from "../demoChats.json"
  let showLogin = true;
  let friends = []
  demoChats.chatlist.forEach((item) => {
    friends.push({ "name": item.name, "publicKey": item.publicKey });
  });

  const CONTRACT_ADDRESS = "0x0c66406F7453acd6C5EC963eB277667F6979c109";

  setContext("activeChat", activeChat);
  setContext("chatHistory", chatHistory);


  // let setActiveChat = () => {
  //       let activeChat = getContext('activeChat')
  //       activeChat.set({"friendName": friend.name, "friendPublicKey": friend.publicKey})
  // }

  let getInput = () => {
    let timestamp = new Date().toUTCString();
    let message = {
      text: document.querySelector("input[name=messageText]").value,
      time: timestamp,
      author: myUsername,
    };
    console.log(myUsername);
    return message;
  };

  let updateChatHistory = () => {
    let newMessage = getInput();
    chatHistory.update((messages) => {
      return [...messages, newMessage];
    });
  };

  // Login to Metamask and check the if the user exists else creates one
  async function login() {
    let res = await connectToMetamask();
    if (res === true) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      try {
        myContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
        const address = await signer.getAddress();
        let present = await myContract.checkUserExists(address);
        let username;
        if (present) username = await myContract.getUsername(address);
        else {
          username = prompt("Enter a username", "Guest");
          if (username === "") username = "Guest";
          await myContract.createAccount(username);
        }
        myUsername = username;
        publicKey = address;
        showLogin = false;
      } catch (err) {
        alert("CONTRACT_ADDRESS not set properly!");
      }
    } else {
      alert("Couldn't connect to Metamask");
    }
  }

  // Check if the Metamask connects
  async function connectToMetamask() {
    try {
      await window.ethereum.enable();
      return true;
    } catch (err) {
      return false;
    }
  }

  // Add a friend to the users' Friends List
  async function addChat(name, publicKey) {
    try {
      let present = await myContract.checkUserExists(publicKey);
      if (!present) {
        alert("Address not found: Ask them to join the app :)");
        return;
      }
      try {
        await myContract.addFriend(publicKey, name);
        const frnd = { name: name, publicKey: publicKey };
        setFriends(friends.concat(frnd));
      } catch (err) {
        alert(
          "Friend already added! You can't be friends with the same person twice ;P"
        );
      }
    } catch (err) {
      alert("Invalid address!");
    }
  }

  // Sends messsage to an user
  async function sendMessage() {
  //  if (!($activeChat && $activeChat.friendPublicKey)) return;
  //   const recieverAddress = activeChat.friendPublicKey;
  //   await myContract.sendMessage(recieverAddress, getInput());
    updateChatHistory();
  }

  // Fetch chat messages with a friend
  async function getMessage(friendsPublicKey) {
    // let nickname;
    // let messages = [];
    // friends.forEach((item) => {
    //   if (item.publicKey === friendsPublicKey) nickname = item.name;
    // });
    // // Get messages
    // const data = await myContract.readMessage(friendsPublicKey);
    // data.forEach((item) => {
    //   const timestamp = new Date(1000 * item[1].toNumber()).toUTCString();
    //   messages.push({
    //     publicKey: item[0],
    //     timeStamp: timestamp,
    //     data: item[2],
    //   });
    // });
    let messages = [];
    let chatToRender
    activeChat.subscribe((value) => {
      chatToRender = value;
    });
    demoChats.chatlist.forEach((item) => {
      if (item.publicKey === chatToRender.friendPublicKey) {
        item.messages.forEach((message) => {
          messages.push(message);
        });
      }
    });
    chatHistory.set(messages);

  }
</script>

<div class="main-container">
  <div class="header">
    {#if showLogin}
      <button on:click={login} class="send-btn">Login</button>
    {:else}
      <p style="padding-right:1rem;">{myUsername}</p>
      <button on:click={()=>getMessage("0xe8992a926aA0d5e1145d54E559eeCceEd7eAcFc4")} class="send-btn">Reload</button>
    {/if}
  </div>
  <div class="chat-module">
    <FriendList friends={friends} reload={getMessage} />
    <div class="chat-box">
      <!-- Chat messages will be rendered here -->
      <FriendList />
      <div class="spacer" />
      {#each $chatHistory as message}
        <ChatMessage
          messageText={message.text}
          messageTime={message.time}
          messageAuthor={message.author}
          isUser={message.author === myUsername}
        />
      {/each}
      <form>
        <input type="text" name="messageText" class="message-input" />
        <button type="submit" on:click={sendMessage} class="send-btn">Send</button>
      </form>
    </div>
  </div>

  
</div>

<style>
  /* make button rounded style */
  .main-container {
    display: flex;
    flex-direction: column;
    height: 90vh;
    align-items: center;
  }

  .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    color: white;
    font-size:large;
  }

  .chat-module {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
  }

  .spacer {
    height: 75vh;
  }
  .chat-box {
    display: flex;
    flex-direction: column;
    overflow: auto;
    flex-grow: 1;
  }

  .message-input {
    border-radius: 1rem;
    font-size: medium;
    background-color: #3b4248;
    color: white;
    width: 80%;
    height: 50px;
  }
  .send-btn {
    border-radius: 5rem;
    width: 100px;
    height: 50px;
    background-color: #326b00;
    color: white;
    font-size: 1.5rem;
    border: none;
  }
</style>
