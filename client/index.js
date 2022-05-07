import Web3 from 'web3';
import Crud from '../build/contracts/Crud.json';

let web3;
let crud;

// Create web3 instance
const initWeb3 = () => {
    return new Promise((resolve, reject) => {
        // Case 1: new Metamask is present
        if (!window.ethereum.enable()) {
            alert("Please install MetaMask to use this dApp!");
          } 
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.enable()
            .then(() => {
                console.log('Hello');
                resolve(
                    new Web3(window.ethereum)
                );
            })
            
            .catch(e => {
                reject(e);
            });
            return;
        }
        // Case 2: old Metamask is present
        if (typeof window.web3 !== 'undefined') {
            return resolve(
                new Web3(window.web3.currentProvider)
            );
        }
        // Case 3: no Metamask, just connect to Ganache
        resolve(new Web3('http://localhost:9545'));
        // location.replace("https://metamask.io");
    });
};

// Initialize Advanced storage contract
const initContract = () => {
    const deploymentKey = Object.keys(
        Crud.networks
    )[0];
    return new web3.eth.Contract(
    Crud.abi,
    Crud
        .networks[deploymentKey].address        
    );
};

// Initialize the app
const initApp = () => {
    const $create = document.getElementById('create');
    const $createResult = document.getElementById('create-result');
    const $read = document.getElementById('read');
    const $readResult = document.getElementById('read-result');
    const $edit = document.getElementById('edit');
    const $editResult = document.getElementById('edit-result');
    const $delete = document.getElementById('delete');
    const $deleteResult = document.getElementById('delete-result');
    let accounts = [];

    web3.eth.getAccounts()
    .then(_accounts =>{
        accounts = _accounts;
    });
    // Create new user
    $create.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = e.target.elements[0].value;
        crud.methods
        .create(name)
        .send({ from: accounts[0]})
            .then(() => {
                $createResult.innerHTML = `New user ${name} was successfully created`;
            })
            .catch(() => {
                $createResult.innerHTML = 'There was an error while trying to create a new user...';
            });
            
    });

    // Read users
    $read.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = e.target.elements[0].value;
        crud.methods
        .read(id)
        .call()
        .then((result) => {
            $readResult.innerHTML = `User id: ${result[0]} User name: ${result[1]}`;
        })
        .catch(() => {
            $readResult.innerHTML = 'No user found for id ${id}...';
        });
    });

    // Update user
    $edit.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = e.target.elements[0].value;
        const name = e.target.elements[1].value;
        crud.methods
        .update(id, name)
        .send({ from: accounts[0] })
        .then(() => {
            $editResult.innerHTML = `User with id ${id} is updated to ${name}`;
        })
        .cath(() => {
            $editResult.innerHTML = `Could not update user with id ${id}...`;
        });
    });

    // Delete user
    $delete.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = e.target.elements[0].value;
        crud.methods
        .destroy(id)
        .send({ from: accounts[0] })
        .then(() => {
            $deleteResult.innerHTML = `User with id ${id} is deleted`;
        })
        .catch(() => {
            $deleteResult.innerHTML = `No user with id ${id} found...`;
        });
    })
};

document.addEventListener('DOMContentLoaded', () => {
    initWeb3()
    .then(_web3 => {
        web3 = _web3;
        crud = initContract();
        initApp();
    })
    .catch(err => console.log(err.message));
})