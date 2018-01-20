web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
abi = JSON.parse(`[
	{
		"constant": true,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getPost",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getNbPosts",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "title",
				"type": "string"
			},
			{
				"name": "content",
				"type": "string"
			}
		],
		"name": "addPost",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			},
			{
				"name": "title",
				"type": "string"
			},
			{
				"name": "content",
				"type": "string"
			}
		],
		"name": "editPost",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "removePost",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
]`)
VotingContract = web3.eth.contract(abi);
web3.eth.defaultAccount= '0x434a2b024e7fdde822410b9846764728ce0ac34c';
// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
contractInstance = VotingContract.at('0xa1b4746edaf10194304a9f65d9dfea09e2329189');

$(document).ready(function($) {
	
	$('#post-form').on('submit', (e) => {
		e.preventDefault();
		console.log('click !', e.currentTarget.title.value, e.currentTarget.content.value)
		// contractInstance.addPost()
		contractInstance.addPost(e.currentTarget.title.value, e.currentTarget.content.value, (err,data) => {
			console.log('article ajouté !', data, err)
		})
	})
	contractInstance.getNbPosts((err,data) =>{
		console.log('nombre de posts', data)
		for(let i=0; i<data.c[0]; i++){

			contractInstance.getPost(i, (err, data) => {
				let postContainer, postTitle, postContent;
				let fragment = document.createDocumentFragment();
				if(data.length > 0){
					postContainer = document.createElement('div');
					postContainer.setAttribute("class", "post-container");
					postTitle = document.createElement('h4');
				postTitle.innerHTML = data[1]
				postContent = document.createElement('p');
				postContent.innerHTML = data[0]
				postContainer.appendChild(postTitle)
				postContainer.appendChild(postContent)
				fragment.appendChild(postContainer)
			}
			document.getElementById('post-list').appendChild(fragment)
			console.log('Result', data, 'Error', err);
		});
		}
	})
});