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
web3.eth.defaultAccount= '0x63b7a5065cf11404941ac39883a873430dfaa133';
// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
contractInstance = VotingContract.at('0xc3ae10d63779b06571a3c76d127856534f20c89a');
var editing = false;
var indexEdit = 0;
$(document).ready(function($) {
	
	$('#post-form').on('submit', (e) => {
		e.preventDefault();
		console.log('click !', e.currentTarget.title.value, e.currentTarget.content.value)
		// contractInstance.addPost()
		if(!editing){

			contractInstance.addPost(e.currentTarget.title.value, e.currentTarget.content.value, (err,data) => {
				console.log('article ajouté !', data, err)
				window.location.reload();
			})
		}else{
			contractInstance.editPost(indexEdit, e.currentTarget.title.value, e.currentTarget.content.value, (err,data) => {
				console.log('article modifié !', data, err)
				window.location.reload();
			})
		}
	})

	$('#cancel-button').on('click', (e)=>{
		e.preventDefault();
		$('#cancel-button').hide();
		let submitButton = document.getElementById('submit-button')
		submitButton.setAttribute('class', 'btn btn-success')
		submitButton.innerHTML ='Publier'
		document.getElementById('title-input').value = ''
		document.getElementById('content-input').value = ''
		editing = false;
	})
	contractInstance.getNbPosts((err,data) =>{
		console.log('nombre de posts', data)
		for(let i=0; i<data.c[0]; i++){

			contractInstance.getPost(i, (err, data) => {
				let postContainer, postTitle, postContent, buttonDelete, buttonEdit;
				let fragment = document.createDocumentFragment();
				if(data.length > 0){
					postContainer = document.createElement('div');
					postContainer.setAttribute("class", "post-container");
					postTitle = document.createElement('h4');
					postTitle.innerHTML = data[1]
					postContent = document.createElement('p');
					postContent.innerHTML = data[0]
					buttonDelete = document.createElement('button')
					buttonDelete.setAttribute("class", "btn btn-danger pull-right")
					buttonDelete.innerHTML = "Supprimer"
					buttonDelete.addEventListener('click', () => { 
						contractInstance.removePost(i, () =>{ 
							//alert('Article '+ data[1] +' supprimé !')
							window.location.reload();
						})
					})
					buttonEdit = document.createElement('button')
					buttonEdit.setAttribute("class", "btn btn-primary pull-right")
					buttonEdit.innerHTML = "Modifier"
					buttonEdit.addEventListener('click', () => { 
						console.log('EDIT ! 	',i)
						document.getElementById('title-input').value = data[1]
						document.getElementById('content-input').value = data[0]
						let submitButton = document.getElementById('submit-button')
						submitButton.setAttribute('class', 'btn btn-primary')
						submitButton.innerHTML ='Modifier'
						$('#cancel-button').show();
						indexEdit = i;
						editing = true;
					})
					postContainer.appendChild(buttonDelete)
					postContainer.appendChild(buttonEdit)
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