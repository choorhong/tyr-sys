import { useState } from "react";
import "./App.css";
import Form from "./component/Form";
import { distributeCard } from "./utils/helper";

function App() {
  const [cards, setCards] = useState<string[][]>();
  const [disabledBtn, setDisabledBtn] = useState<boolean>();

  const handleDisplayCards = async (num: number) => {
    let result = distributeCard(num);
    try {
      const response = await fetch("http://localhost/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numberOfUser: num,
        }),
      });
      if (response.ok) {
        result = await response.json();
      }
      setCards(result);
      setDisabledBtn(true);
    } catch (error) {
      setCards(result);
    }
  };

  const restart = () => {
    setDisabledBtn(false);
  };

  return (
    <div className="App">
      <div className="form-container">
        <Form
          onHandleDisplayCards={handleDisplayCards}
          disabledBtn={disabledBtn}
        />
      </div>
      <div className="card-container">
        {cards?.map((item, index) => (
          <div
            key={`${index}-${item.length}`}
            className="distributed-card-container"
          >
            <>
              <p className="distributed-card-text">
                {`User ${index + 1} receives: ${item.join(", ")}.`}
              </p>
              <p className="distributed-card-text">
                Number of card(s) received: {item.length}
              </p>
            </>
          </div>
        ))}
        {cards?.length ? (
          <button
            className="button btn-margin"
            onClick={restart}
            disabled={!disabledBtn}
          >
            Restart
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default App;
