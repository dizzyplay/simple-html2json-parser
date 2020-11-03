class Node {
	constructor (tag) {
		this.tag = tag;
		this.child = [];
		this.value = [];
		this.attribute = [];
	}

	addChild (node) {
		this.child.push(node);
	}

	addValue (value) {
		this.value.push({ text: value });
	}
}

const parser = html => {
	html = html.replace(/\n/g, '');
	const stack = [];
	let result = [];
	while (html.length > 0) {
		switch (html[0]) {
			case '<':
				if (html[1] === '/') {
					if (stack.length > 1) {
						let last = stack.pop();
						let top = stack.pop();
						top.addChild(last);
						stack.push(top);
					} else {
						result.push(stack.pop());
					}
					const [_, rest] = extractWord(html.slice(2));
					html = rest.slice(1);
				} else {
					const [word, rest] = extractWord(html.slice(1));
					const t = word.split(' ');
					const node = new Node(t[0]);
					if (t.length > 1) {
						const attrs = t.slice(1);
						node.attribute = attrs.map(attr => {
							const r = attr.split('=');
							return { [r[0]]: r[1].replace(/"/g, '') };
						});
					}
					stack.push(node);
					if (rest[0] === '/') {
						// self closing
						const selfClosing = stack.pop();
						if (stack.length > 0) {
							const top = stack.pop();
							top.addChild(selfClosing);
							stack.push(top);
						} else {
							result.push(selfClosing);
						}
						html = rest.slice(2);
					} else {
						html = rest.slice(1);
					}
				}
				break;
			default:
				const [word, rest] = extractWord(html);
				if (stack.length > 0) {
					let top = stack.pop();
					if (top.child.length > 0){
						// <span><span>a</span> this situation</span>
						const node = new Node('span');
						node.addValue(word)
						top.addChild(node);
						stack.push(top);
					}else {
						// <span>this situation</span>
						top.addValue(word)
						stack.push(top);
					}
				} else {
					const node = new Node('span');
					node.addValue(word);
					result.push(node);
				}
				html = rest;
		}
	}
	return [...result, ...stack];
};

const extractWord = html => {
	let word = [];
	let end = 0;
	for (const v of html) {
		if (/[a-z0-9가-힣 .,"=』『+)(]/i.test(v)) {
			word.push(v);
			end++;
		} else break;
	}
	return [word.join(''), html.slice(end)];
};

// console.info(JSON.stringify(parser(`
// <span id="w19"><span id="w11">우리는</span> 강을 따라 <span id="w12">걷는다.</span></span>
// `), null, 2));

// console.info(extractWord('a</p>'));
// console.info(JSON.stringify(parser('<span>i <b>am</b> a boy</span>'),null,2));
// console.info(JSON.stringify(parser(`<span id="w1" class="something">aaa<sub>주어</sub><br/></span><br/>`)));
console.info(JSON.stringify(parser(`
<span id="w3">I <span id="w16">sleep</span></span> in a bed.<br/>
<span id="w4">나는</span> 침대에서 <span id="w5">잔다.</span>
<br/>
<br/>
<span id="w6">My mom</span> always <span id="w7">smiles.</span><br/>
<span id="w8">우리 엄마는</span> 항상 <span id="w9">웃으신다.</span>
<br/>
<br/>
<span id="w10">We <span id="w17">walk</span></span> along the river.<br/>
<span id="w19"><span id="w11">우리는</span> 강을 따라 <span id="w12">걷는다.</span></span>
<br/>
<br/>
<span id="w13">The dogs <span id="w18">run</span></span> very fast.<br/>
<span id="w14">그 개들은</span> 매우 빠르게 <span id="w15">달린다.</span>
<br/>
<br/>
`),null,2))

// console.info(JSON.stringify(parser(`
// <b>Point 1. 『주어+동사』로 의미가 완전한 문장</b><br/>
// 『주어+동사』로 이루어지며, 이 자체로 의미가 성립하는 문장이다. 수식어구와 함께 쓰여 문장이 길어지는 경우가 많다.
// `),null,2));

// console.info(JSON.stringify(parser(`<br/>`)));
// console.info(JSON.stringify(parser(`<span>aaaaa<br/>aaa<span>hello</span><br/>aaaaa<br/></span><br/>`)));

// console.info(JSON.stringify(parser(`<span id="w1">I<sub>주어</sub></span> <span id="w2">sleep<sub>동사</sub></span> this is good <span>in a bed.<sub>수식어구</sub></span><br/>
// <span>나는 침대에서 잔다</span>`)))

// console.info(JSON.stringify(parser(`
// <span id="w13">The dogs <span id="w18">run</span></span> very fast.<br/>
// <span id="w14">그 개들은</span> 매우 빠르게 <span id="w15">달린다.</span>
// `)));

// console.info(JSON.stringify(parser(`<span id="w2">sleep<sub>동사</sub></span><span> in a bed.<sub>수식어구</sub></span><br/><span>나는 침대에서 잔다</span>`)));
// console.info(JSON.stringify(parser(`<span> in a bed.<sub>수식어구</sub></span><br/><span>나는 침대에서 잔다</span>`)));
// 새로운 태그를 만나면 스택에 넣는다
// 태그가 아닌 문자를 만나면 스택 맨위에 있는것을 팝해서 해당 태그의 값으로서 추가한다
// 태그가 닫히면 스택을 팝하고 한번더 팝한 노드의 자식으로 추가한다.

// [{ "text":"i am a boy", styles:[
//       { "type":"bold", "target":["idx":0, word:"am"]}
//       ]
// }]

