const json = [
	{
		text: 'i am a boy.',
		styles: [
			{
				type: 'bold',
				target:{
					idx: 0,
					word: 'am'
				}
			},
			{
				type: 'underline',
				target:{
					idx: 0,
					word: 'boy'
				}
			}
		]
	},
];

class Sentence {
	constructor (obj) {
		this.sentence = obj.text
		this.text = obj.text.split('').map(t => ({char:t,style:t}));
		this.styles = obj.styles;
		this.idx = obj.idx;
	}
	applyStyle(){
		this.styles.forEach(s => {
			const [start,end] = getIndex({target:s.target.word, source:this.sentence, cycle: s.target.idx})
			this.text[start].style = `<${s.type}>` + this.text[start].style;
			this.text[end].style = this.text[end].style + `</${s.type}>`
		})
		return this.text.map(t => t.style).reduce((acc,v)=> acc+=v,'')
	}
}

const s = new Sentence(json[1])
console.info(s.applyStyle());

const parser = json => {
	const choppingSentence = json.text.split('');

};

function getIndex({ target, source, cycle }) {
	const re = new RegExp(target, 'g');
	let match;
	let idx = [];
	while ((match = re.exec(source)) != null) {
		idx.push(match.index);
	}
	const start = idx[cycle];
	const end = start + target.length - 1;
	return [start, end];
};

// console.log(getIndex({ target: 'am', source: 'i am a boy.am and i am good', cycle: 1 }));
