class Node{
	constructor (tag) {
		this.tag = tag
		this.child = []
		this.value =[]
		this.attribute = []
	}
	addChild(node){
		this.child.push(node)
	}
	addValue(value){
		this.value.push({text:value})
	}
}

const parser = html => {
	html = html.replace('\n','');
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
					const t = word.split(' ');
					const node = new Node(t[0]);
					if (t.length > 1){
						const attrs = t.slice(1)
						node.attribute = attrs.map(attr => {
							const r = attr.split('=');
							return {prop:r[0], value:r[1].replace(/"/g,'')}
						})
					}
					stack.push(node);
					if (rest[0] === '/'){
						// self closing
						const selfClosing = stack.pop();
						if (stack.length > 0){
							const top = stack.pop()
							top.addChild(selfClosing)
							stack.push(top);
						}else {
							result.push(selfClosing);
						}
						html = rest.slice(2);
					}else {
						html = rest.slice(1);
					}
				}
				break;
			default:
				const [word, rest] = extractWord(html)
				if (stack.length > 0){
					let top = stack.pop();
					top.addValue(word);
					stack.push(top);
				}else {
					const node = new Node('span')
					node.addValue(word)
					result.push(node)
				}
				html = rest;
		}
	}
	return [...result,...stack];
}

const extractWord = html => {
	let word = [];
	let end =0;
	for( const v of html){
		if (/[a-z0-9가-힣 ."=]/i.test(v)){
			word.push(v);
			end++;
		}else break;
	}
	return [word.join(''), html.slice(end)]
}

// console.info(extractWord('a</p>'));
// console.info(JSON.stringify(parser('<span>i <b>am</b> a boy</span>'),null,4));

// console.info(JSON.stringify(parser(`<span id="w1" class="something">aaa<sub>주어</sub><br/></span><br/>`)));
// console.info(JSON.stringify(parser(`<br/>`)));
// console.info(JSON.stringify(parser(`<span>aaaaa<br/>aaa<span>hello</span><br/>aaaaa<br/></span><br/>`)));

console.info(JSON.stringify(parser(`<span id="w1">I<sub>주어</sub></span> <span id="w2">sleep<sub>동사</sub></span> this is good <span>in a bed.<sub>수식어구</sub></span><br/>
<span>나는 침대에서 잔다</span>`)))


// console.info(JSON.stringify(parser(`<span id="w2">sleep<sub>동사</sub></span><span> in a bed.<sub>수식어구</sub></span><br/><span>나는 침대에서 잔다</span>`)));
// console.info(JSON.stringify(parser(`<span> in a bed.<sub>수식어구</sub></span><br/><span>나는 침대에서 잔다</span>`)));
// 새로운 태그를 만나면 스택에 넣는다
// 태그가 아닌 문자를 만나면 스택 맨위에 있는것을 팝해서 해당 태그의 값으로서 추가한다
// 태그가 닫히면 스택을 팝하고 한번더 팝한 노드의 자식으로 추가한다.


// [{ "text":"i am a boy", styles:[
//       { "type":"bold", "target":["idx":0, word:"am"]}
//       ]
// }]

