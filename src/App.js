import "./App.css";
import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFreind] = useState(null);
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
  }
  function handleSelection(friend) {
    setSelectedFreind((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFreind(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <button
          className="button"
          onClick={() => setShowAddFriend(!showAddFriend)}
        >
          {showAddFriend ? "close" : "Add Friend"}
        </button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = friend.id === selectedFriend?.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${friend.balance}
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          you owe ${Math.abs(friend.balance)} to {friend.name}
        </p>
      )}
      {friend.balance === 0 && <p className="gray">both are settled</p>}
      <button className="button" onClick={() => onSelection(friend)}>
        {isSelected ? "close" : "select"}
      </button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID;
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48?u=499476");
  }
  return (
    <form className="form-add-friend">
      <label>👬 Friend Name </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🌉 Image URL </label>
      <input
        type="text"
        placeholder="https://image.jpeg/"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <button className="button" onClick={handleSubmit}>
        ADD
      </button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [myBill, setMyBill] = useState("");
  const paidByFriend = bill ? bill - myBill : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !myBill) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -myBill);
  }
  return (
    <form className="form-split-bill" onSubmit={(e) => handleSubmit(e)}>
      <h2>Split a bill with {selectedFriend.name}.</h2>

      <label>💰 Bill Value </label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍‍♂️ Your expense </label>
      <input
        type="text"
        value={myBill}
        onChange={(e) =>
          setMyBill(
            Number(e.target.value) > bill ? myBill : Number(e.target.value)
          )
        }
      />

      <label>🧍 {selectedFriend.name}'s expense </label>
      <input type="text" value={bill - myBill} disabled />

      <label>🤑 Who is paying your bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="you">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <button className="button">split bill</button>
    </form>
  );
}
