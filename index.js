web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
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
//http://jonathanpatrick.me/blog/ethereum-compressed-text
VotingContract = web3.eth.contract(abi);
web3.eth.defaultAccount= web3.eth.accounts[0];
// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
contractInstance = VotingContract.at('0x002ad38e0eed9034e5a280822f1b9f61c9664889');
var editing = false;
var indexEdit = 0;
//var my_lzma = new LZMA("https://unpkg.com/lzma@2.3.2/src/lzma_worker.js")

var quill = new Quill('#editor', {
    theme: 'snow'
  });
/*function ab2str(buf) {
	return String.fromCharCode.apply(null, new Uint16Array(buf));
  }

  function str2ab(str) {
	var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
	var bufView = new Uint16Array(buf);
	for (var i=0, strLen=str.length; i < strLen; i++) {
	  bufView[i] = str.charCodeAt(i);
	}
	return buf;
  }

  function toHexString(byteArray) {
	return Array.prototype.map.call(byteArray, function(byte) {
	  return ('0' + (byte & 0xFF).toString(16)).slice(-2);
	}).join('');
  }
  function buf2hex(buffer) { // buffer is an ArrayBuffer
	return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }*/
jQuery('#post-form').on('submit', (e) => {
	e.preventDefault();
	// console.log('click !', e.currentTarget.title.value,
	// e.currentTarget.content.value)
	
	/*console.log("UNCOMPRESS",content.length, content);
	var output = LZUTF8.compress(content, ["Base64"]);
	console.log("COMPRESS", output.length, output)
	var hexContent = buf2hex(output.buffer);
	console.log('HEX CONTENT', hexContent.length, hexContent)*/
	// my_lzma.compress(content, 9, (result, error) => {
	// 	//console.log(result, result.length)
	// 	var buf = new Uint8Array(result).buffer;
	// 	//var compressed = '0x' + buffer.toString('hex');
	// 	var comp = buf2hex(buf)
	// 	console.log('HEX', result, comp.length, result.length)
	// 	my_lzma.decompress(result, (data, error) => {
	// 		console.log(data.length)
	// 	}, (percent) => {});
	// 	},(percent) => {})
	// 	return;
	//console.log('RESULT', result)
	//var buf = new Buffer(result);
// console.log('UNCOMPRESS', content.length)
// my_lzma.compress(content, 7, (result, error) => {
// 	var enc = new TextDecoder();
// 	var enc2 = new TextEncoder("utf-8");
// 	var buf = new Uint8Array(result);
	
// 	var compressed = '0x' + buf.toString('utf8');
// 	console.log('COMPRESS', result.length, result)

// 	my_lzma.decompress(compressed, (result2, error2) => {
// 		console.log('DECOMPRESS', result2)
// 	})
// });
let content = quill.container.firstChild.innerHTML
	if(!editing){

		contractInstance.addPost(e.currentTarget.title.value, content, {gas: 5000000}, (err,data) => {
			console.log('article ajouté !', data, err)
			window.location.reload();
		})
	}else{
		contractInstance.editPost(indexEdit, e.currentTarget.title.value, content, {gas: 5000000}, (err,data) => {
			console.log('article modifié !', data, err)
			window.location.reload();
		})
	}
})

//})


document.getElementById('cancel-button').addEventListener('click', function(e){
	e.preventDefault();
	this.setAttribute('style', 'display:none;');
	let submitButton = document.getElementById('submit-button')
	submitButton.setAttribute('class', 'btn btn-success')
	submitButton.innerHTML ='Publier'
	document.getElementById('title-input').value = ''
	quill.container.firstChild.innerHTML = ''
	editing = false;
})
contractInstance.getNbPosts((err,data) =>{
	console.log('nombre de posts', data.c[0])
	for(let i=0; i<data.c[0]; i++){

		contractInstance.getPost(i, {gas: 5000000}, (err, data) => {
			console.log('DATA', i, data, err)
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
					contractInstance.removePost(i, {gas: 5000000}, (err, data) =>{ 
						console.log('Article supprimé !', err)
						window.location.reload();
					})
				})
				buttonEdit = document.createElement('button')
				buttonEdit.setAttribute("class", "btn btn-primary pull-right")
				buttonEdit.innerHTML = "Modifier"
				buttonEdit.addEventListener('click', () => { 
					console.log('EDIT ! 	',i)
					document.getElementById('title-input').value = data[1]
					quill.container.firstChild.innerHTML = data[0]
					let submitButton = document.getElementById('submit-button')
					submitButton.setAttribute('class', 'btn btn-primary')
					submitButton.innerHTML ='Modifier'
					document.getElementById('cancel-button').setAttribute('style', 'display:inline;');
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
			//console.log('Result', data, 'Error', err);
		});
	}
})
