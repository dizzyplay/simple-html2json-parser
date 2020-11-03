const json = require('./test.json');
const json2 = require('./test2.json');
const json3 = require('./test3.json');
const json4 = require('./test4.json');
const json5 = require('./test5.json');
const json6 = require('./test6.json');


function traversal(obj){
	let queue = [obj]
	const frontStack = [];
	const backStack = [];
	while(queue.length > 0){
		const o = queue.shift()
		if (o.tag !== 'br'){
			frontStack.push(`<${o.tag}${o.attribute.reduce((acc,v)=>acc+=` id="${v.id}"`,'')}>${o.value.reduce((acc,v)=> acc+=v.text,'')}`);
			backStack.push(`</${o.tag}>`)
		}else {
			frontStack.push(`__br__`);
		}
		if(o.child.length > 0){
			queue = [...queue,...o.child]
		}
	}
	const result = []
	while(frontStack.length > 0){
		const v = frontStack.pop();
		if (v === '__br__'){
			result.unshift(`<br/>`)
		}else {
			result.unshift(v)
			result.push(backStack.pop())
		}
	}
	console.info(result.reduce((acc,v)=> acc+=v,''));
}

(()=>{
	json5.forEach( j => {
		traversal(j);
	})
})()