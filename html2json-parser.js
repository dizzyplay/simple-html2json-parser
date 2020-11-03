class Node{
	constructor (tag) {
		this.tag = tag
		this.child = []
		this.value =[]
	}
	addChild(node){
		this.child.push(node)
	}
	addValue(value){
		this.value.push({text:value})
	}
}

const parser = html => {
	const stack =[];
	let result = [];
	while(html.length > 0){
		switch (html[0]){
			case '<':
				if (html[1] === '/'){
					if (stack.length > 1){
						let last = stack.pop()
						let top = stack.pop()
						top.addChild(last);
						stack.push(top);
					}else{
						result.push(stack.pop())
					}
					const [_, rest] = extractWord(html.slice(2))
					html = rest.slice(1);
				}else {
					const [word, rest] = extractWord(html.slice(1))
					stack.push(new Node(word))
					html = rest.slice(1);
				}
				break;
			default:
				const [word, rest] = extractWord(html)
				let top = stack.pop();
				top.addValue(word);
				stack.push(top);
				html = rest;
		}
	}

	result = [...result, ...stack]
	return result;
}

const extractWord = html => {
	let word = [];
	let end =0;
	for( const v of html){
		if (/[a-z .]/i.test(v)){
			word.push(v);
			end++;
		}else break;
	}
	return [word.join(''), html.slice(end)]
}

// console.info(extractWord('a</p>'));
console.info(JSON.stringify(parser('<span>i <b>am</b> a boy</span>'),null,4));

// 새로운 태그를 만나면 스택에 넣는다
// 태그가 아닌 문자를 만나면 스택 맨위에 있는것을 팝해서 해당 태그의 값으로서 추가한다
// 태그가 닫히면 스택을 팝하고 한번더 팝한 노드의 자식으로 추가한다.


// [{ "text":"i am a boy", styles:[
//       { "type":"bold", "target":["idx":0, word:"am"]}
//       ]
// }]

