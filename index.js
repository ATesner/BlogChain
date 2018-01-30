// parse l'abi (interface du smart contrat)
abi = JSON.parse(`[
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
		"inputs": [
			{
				"name": "o",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
]`)
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); // connection a la blockchain local
blogChainContract = web3.eth.contract(abi); // set l'interface de notre contrat
// set le compte avec lequel on fera appel aux methodes du contract (ici le premier trouvé dans notre blockchain local)
web3.eth.defaultAccount= web3.eth.accounts[0]; 
//recupere le contrat via son adresse
contractInstance = blogChainContract.at('0xc1d911def56c53128c5260499a52c60d893fbac8');

var editing = false; // pour indiquer si l'on est en mode edition ou publication
var indexEdit = 0; //pour savoir quel article on modifie
var quill = new Quill('#editor', { //cree l'editeur WYSIWYG
    theme: 'snow'
});

// lorsque l'on clique sur "Publier" ou "Modifier"
document.getElementById('submit-button').addEventListener('click', (e) => {
	e.preventDefault();
	let content = quill.container.firstChild.innerHTML; //recupere le titre
	let title = document.getElementById('title-input'); //recupere le contenu
	
	if(!editing){ //si on veut publier
		//appel la methode addPost du smart contract
		contractInstance.addPost(title.value, content, {gas: 5000000}, (err,data) => {
			console.log('article ajouté !', data, err)
			window.location.reload(); //refresh de la page une fois l'article ajouté
		})

	}else{ // si on veut modifier
		//appel la methode editPost du smart contract
		contractInstance.editPost(indexEdit, title.value, content, {gas: 5000000}, (err,data) => {
			console.log('article modifié !', data, err)
			window.location.reload(); //refresh de la page  une fois l'article ajouté
		})
	}
})

//lorsque l'on clique sur "Annuler"
document.getElementById('cancel-button').addEventListener('click', function(e){
	e.preventDefault();
	this.setAttribute('style', 'display:none;'); //cache le bouton "Annuler"
	let submitButton = document.getElementById('submit-button'); //recupere le bouton "Modifier"
	submitButton.setAttribute('class', 'btn btn-success'); //change la couleur du bouton en vert
	submitButton.innerHTML ='Publier'; //set le libelle du bouton
	document.getElementById('title-input').value = ''; //vide le titre
	quill.container.firstChild.innerHTML = ''; //vide le contenu
	editing = false; //indique que l'on est plus en mode edition
})

//Recupere le nombre d'articles
contractInstance.getNbPosts((err,data) =>{
	console.log('nombre de posts', data.c[0])

	for(let i=0; i<data.c[0]; i++){ //parcours des index
		
		contractInstance.getPost(i, {gas: 5000000}, (err, data) => { //recupere l'article avec l'index courant
		console.log('DATA', i, data, err)
		//definition des variables utilisés pour créer la liste d'article
			let postContainer, postTitle, postContent, buttonDelete, buttonEdit;

			if(data.length > 0){ //si on a au moins un article

				postContainer = document.createElement('div'); //cree la div qui contiendra l'article
				postContainer.setAttribute("class", "post-container");
				postTitle = document.createElement('h4'); //contiendra le titre
				postTitle.innerHTML = data[1]; //ajout du titre
				postContent = document.createElement('p'); //contiendra le contenu de l'article
				postContent.innerHTML = data[0]; //ajout du contenu

				//creation d'un bouton supprimer
				buttonDelete = document.createElement('button');
				buttonDelete.setAttribute("class", "btn btn-danger pull-right")
				buttonDelete.innerHTML = "Supprimer"; //set le libelle
				buttonDelete.addEventListener('click', () => { //event lors du clique
					//supprime l'article du smart contract
					contractInstance.removePost(i, {gas: 5000000}, (err, data) =>{ 
						console.log('Article supprimé !', err)
						window.location.reload();
					})
				})

				//creation d'un bouton editer
				buttonEdit = document.createElement('button')
				buttonEdit.setAttribute("class", "btn btn-primary pull-right")
				buttonEdit.innerHTML = "Modifier"; //set le libelle
				buttonEdit.addEventListener('click', () => { //event lors du click
					//le formulaire d'ajout servira pour la modification
					document.getElementById('title-input').value = data[1]; //set du titre
					quill.container.firstChild.innerHTML = data[0]; //set le contenu
					//modification du bouton "Publier"
					let submitButton = document.getElementById('submit-button');
					submitButton.setAttribute('class', 'btn btn-primary'); //modifie son theme
					submitButton.innerHTML ='Modifier'; //modifie son libelle
					//affiche le bouton annuler
					document.getElementById('cancel-button').setAttribute('style', 'display:inline;');
					indexEdit = i; //sauvegarde l'index de l'article que l'on est en train de modifier
					editing = true; //inque que l'on est en mode edition
				})
				//ajout des composants
				postContainer.appendChild(buttonDelete);
				postContainer.appendChild(buttonEdit);
				postContainer.appendChild(postTitle);
				postContainer.appendChild(postContent);
				document.getElementById('post-list').appendChild(postContainer); //ajout des composants dans le DOM
			}
		});
	} // FIN PARCOURS DES INDEX
	
})
