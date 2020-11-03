const json = require('./test.json');


function traversal(obj){
	let queue = [obj]
	const frontStack = [];
	const backStack = [];
	while(queue.length > 0){
		const o = queue.shift()
		if (o.tag !== 'br'){
			frontStack.push(`<${o.tag}${o.attribute.reduce((acc,v)=>acc+=` ${v.prop}="${v.value}"`,'')}>${o.value.reduce((acc,v)=> acc+=v.text,'')}`);
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
	json.forEach( j => {
		traversal(j);
	})
})()