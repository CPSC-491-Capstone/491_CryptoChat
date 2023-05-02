<script>
  import { ethers } from "ethers";
  import { abi } from "../abi";
  import { activeChat, chatHistory } from "../stores/store";
  import ChatMessage from "./ChatMessage.svelte";
  import FriendList from "./FriendList.svelte";
  import AddFriendModal from "./AddFriendModal.svelte";
  let publicKey = "";
  let myUsername = "";
  let showModal = false;
  let myContract = null;
  let showLogin = true;
  let friends = [];
  const CONTRACT_ADDRESS = "0x9e2a714eAD4AF0bD22C3b1D8A62EA9Af1c38f159";

  const addFriend = () => {
    let friendName = document.querySelector("input[name=friendName]").value;
    let friendPublicKey = document.querySelector(
      "input[name=friendPublicKey]"
    ).value;
    addChat(friendName, friendPublicKey);
    document.querySelector("input[name=friendName]").value = "";
    document.querySelector("input[name=friendPublicKey]").value = "";
    showModal = false;
    dialog.close();
  };

  let getInput = () => {
    let timestamp = new Date().toUTCString();
    let message = {
      text: document.querySelector("input[name=messageText]").value,
      time: timestamp,
      author: myUsername,
    };
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
        console.error("Error in contract interaction:", err);
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
    let messages = [];
    // Get messages
    try {
      const data = await myContract.readMessage(friendsPublicKey);
      const messagePromises = data.map(async (item) => {
        const timestamp = new Date(1000 * item[1].toNumber()).toUTCString();
        const author = await myContract.getUsername(item[0]);
        return {
          author: author,
          publicKey: item[0],
          time: timestamp,
          text: item[2],
        };
      });
      messages = await Promise.all(messagePromises);
    } catch (error) {
      console.error("An error occurred while fetching the messages:", error);
    }
    chatHistory.set(messages);
  }
  // Fetches the friend list of the user
  async function getFriendList() {
    try {
      const friendList = await myContract.getMyFriendList();
      // populate the friends with the friend list
      friendList.forEach((item) => {
        friends = [...friends, { name: item[1], publicKey: item[0] }];
      });
    } catch (error) {
      console.error("An error occurred while fetching the friend list:", error);
    }
  }
</script>

<div class="main-container">
  <div class="header">
    {#if showLogin}
      <button
        on:click={() =>
          login().then(() => {
            getFriendList();
          })}
        class="send-btn">Login</button
      >
    {:else}
      <p style="padding-right:1rem;">{myUsername}</p>
      <button on:click={() => (showModal = true)} class="send-btn"
        >Add Friend</button
      >
    {/if}
  </div>
  <!-- Modal -->
  <AddFriendModal bind:showModal>
    <form>
      <label for="friendName">Friend Name</label>
      <input type="text" id="friend-name" name="friendName" />
      <label for="friendPublicKey">Friend Address</label>
      <input type="text" id="friend-address" name="friendPublicKey" />
    </form>
    <button on:click={() => addFriend()} type="submit">Submit</button>
  </AddFriendModal>
  <!-- Chat box -->
  <div class="chat-module">
    <FriendList {friends} reload={getMessage} />
    <div class="chat-box">
      <!-- Chat messages will be rendered here -->
      <FriendList />
      <div class="spacer" />
      <div class="message-group">
        {#each $chatHistory as message}
          <ChatMessage
            messageAuthor={message.author}
            messageText={message.text}
            messageTime={message.time}
            isUser={message.author === myUsername}
          />
        {/each}
      </div>
      <form>
        <input type="text" name="messageText" class="message-input" />
        <button type="submit" on:click={sendMessage} class="send-btn"
          >Send</button
        >
      </form>
    </div>
  </div>
</div>

<style>
  .message-group {
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }
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
    font-size: large;
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
