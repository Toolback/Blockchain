import React, { useEffect, useState, useRef } from "react";
import abi from '../utils/PoetryWall.json';
import { ethers } from "ethers";
import './App.css';
// import { Line } from "three";

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  // const [poetName, setName] = useState("");
  // const [poetTitle, setTitle] = useState("");
  // const [poetText, setText] = useState("");
  const inputRefName = useRef();
  const inputRefTitle = useRef();
  const inputRefText = useRef();




  // All state property to store all poems (?);

  const contractAddress = "0x09643eE9fd4F7e8CA2934b628ab1D153AaFC0f46";
  const [allPoems, setAllPoems] = useState([]);
  const contractABI = abi.abi;


  // Method to get all poems from contract

  const getAllPoems = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const poetryPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        // Call the getAllPoems method from contract
        const poems = await poetryPortalContract.getAllPoems();

        // declare infos for UI

        const poemsCleaned = poems.map(line => {
          return {
            address: line.author,
            name: line.name,
            title: line.title,
            text: line.text,
            timestamp: new Date(line.timestamp * 1000),
          }
        })

        // Store data in react store

        setAllPoems(poemsCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
 * Listen in for emitter events!
 */
useEffect(() => {
  let poetryPortalContract;

  const onNewPoem = (from, _name, _title, _text, timestamp) => {
    console.log('NewPoem', from, _name, _title, _text, timestamp);
    setAllPoems(prevState => [
      ...prevState,
      {
        address: from,
        name: _name,
        title: _title,
        text: _text,
        timestamp: new Date(timestamp * 1000),
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    poetryPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    poetryPortalContract.on('NewPoem', onNewPoem);
  }

  return () => {
    if (poetryPortalContract) {
      poetryPortalContract.off('NewPoem', onNewPoem);
    }
  };
}, []);

  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllPoems();

      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }



  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const poem = async () => {
    // setName(e.target.value);
    // setTitle(e.target.value);
    // setText(e.target.value);



    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const poetryPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await poetryPortalContract.getTotalPoems();
        console.log("Retrieved total wave count...", count.toNumber());

        const poemTxn = await poetryPortalContract.poem(inputRefName.current.value, inputRefTitle.current.value, inputRefText.current.value, {gasLimit:3000000});
        console.log("Mining...", poemTxn.hash);

        await poemTxn.wait();
        console.log("Mined -- ", poemTxn.hash);

        count = await poetryPortalContract.getTotalPoems();
        console.log("Retrieved total wave count...", count.toNumber());


      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
    
  }


  
  return (
    <div className="mainContainer">
      <div className="navbar">
        <div className="logo">Poets Society</div>
        <div className="navlinks">
          <ul className="navlinks-ul">
            <li className="navlinks-li">                {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="poemButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}</li>
            <li className="navlinks-li">Home</li>
            <li className="navlinks-li">portfolio</li>
          </ul>
        </div>
      </div>
         

      <div className="dataContainer">
        <div className="header">
        📖 Hey Nice Soul !
        </div>

        <div className="bio">
        Time for you to share your words with others, and have a chance to win ethers for your thougts ! 
        </div>
        <div className="bio">
        You need Metamask and Rinkeby TestNet install !
        </div>


        <div className="PoemForm">
          <h4 className="infosPoemForm">Name :</h4>
          <input className="input-poem-name" ref={inputRefName} />
          <h4 className="infosPoemForm">Title :</h4>
          <input className="input-poem-title" ref={inputRefTitle} />
          <h4 className="infosPoemForm">Your Lines ...</h4>
          <textarea className="input-poem-text" ref={inputRefText} />


          <button className="writeAPoem" onClick={poem}>
          Post on the wall ! 
        </button>
        </div>




        


      </div>
      
      {allPoems.map((line, index) => {
          return (
            <div className="ListofAllPoem">
            <div key={index} className="AllPoems">
              <div className="ListofAllPoems">
              <div>From : {line.address}</div>
              <div>Author : {line.name}</div>
              <div>Title : {line.title}</div>
              <div><em>"{line.text}"</em></div>
              <div>Posted: {line.timestamp.toString()}</div>
              </div>
            </div>
            </div>
            
            )
        })}
      </div>
    
  );
}