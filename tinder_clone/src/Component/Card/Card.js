import React, { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import "./card.css";
import { useSelector, useDispatch } from "react-redux";
import { onRightswipe } from "../../storeSlice";
// import axios from "../../axios";
// import database from "./fbase";
// import { collection, onSnapshot } from "firebase/firestore";
// import { getDocs } from 'firebase/firestore';

function TinderCards() {
  const { allUsers } = useSelector((state) => state.root);
  const dispatch = useDispatch();
  const [people, setPeople] = useState([]);
  // console.log("allUsers", allUsers);
  // console.log("people--people==**", people);
  useEffect(() => {
    setPeople(allUsers);
  }, [allUsers]);
  const swiped = (direction, nameToDelete, personId) => {
    if (direction === "right") {
      dispatch(onRightswipe(personId));
    }
  };

  const outOfFrame = (name) => {
    console.log(name, "this person has removed");
  };
  return (
    <div className="CardContainer">
      {people.map((person, index) => {
        return (
          <TinderCard
            className="swipe"
            key={index}
            preventSwipe={["up", "down"]}
            onSwipe={(dir) => swiped(dir, person?.fname, person?._id)}
            onCardLeftScreen={() => {
              outOfFrame(person?.fname);
            }}
          >
            <div
              style={{ backgroundImage: `url(${person?.profilePicture})` }}
              className="card"
            >
              <h1>{person?.fname}</h1>
            </div>
          </TinderCard>
        );
      })}
    </div>
  );
}

export default TinderCards;
