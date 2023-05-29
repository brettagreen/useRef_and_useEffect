import {useState, useEffect, useRef} from 'react';
import axios from "axios";

function DeckOfCards() {

    const [src, setSrc] = useState(null);
    const [deck, setDeck] = useState(null);
    const [intrvlId, setIntrvlId] = useState(null);

    const btn = useRef();

    function startStop() {
        let card;
        if (!intrvlId) {
            const timer = setInterval(async function() {
                card = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);
                setSrc(card.data.cards[0].images.png);
                //console.log('cards remaining', card.data.remaining);
                if (card.data.remaining === 0) {
                    //console.log('remaining===0', timer);
                    clearInterval(timer);
                    setIntrvlId(null);
                    btn.current.textContent = 'Play again';
                }             
            }, 1000);
            //console.log("NOW SETTING INTERVAL ID", timer);
            setIntrvlId(timer);  

            btn.current.textContent = 'Click to stop drawing cards';
        } else {
            clearInterval(intrvlId);
            setIntrvlId(null);
            btn.current.textContent = 'Play again';
        }
    }

    useEffect(() => {
        async function reshuffleDeck() {
            if (!intrvlId && deck) {
                // console.log('deck', deck);
                // console.log('deckid', deck.deck_id);
                // console.log('am i getting to the if statement');
                // console.log('this is the useEffect intrvlId', intrvlId);
                const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle`);
                setDeck(res.data);
            }
        }
        reshuffleDeck();

    }, [intrvlId]);

    useEffect(() => {
        async function getDeck() {
            const res = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1&jokers_enabled=true');
            setDeck(res.data);
        }

        getDeck();
        //console.log("set state for 'deck' ");
    }, []);

    return(
        <section>
            <div>
                {src ? <img alt="card" src={src}/> : null}
            </div>
            <div>
                <button onClick={startStop} ref={btn}>Click to draw a card</button>
            </div>
        </section>
    )
}

export default DeckOfCards;