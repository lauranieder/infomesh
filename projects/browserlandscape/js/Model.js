class Model {
	constructor(node, position, src, dimensions, id, scenario) {
		this.position = position;
		this.dims = new THREE.Vector3(dimensions,dimensions,dimensions);
		this.src = node.src;

		this.height;
		this.width;

		this.node = node;
		this.model;
		this.id = id

		this.scenario = scenario;

		// this.scenario = {
		// 	1994: "appear",
		//	1996: "change: ./imgs/scroll_7.png",
		// 	1996: "change: ./imgs/scroll_7.png",
		// 	2000: "destroy",
		// };

		this.init();
	}

	init() {
		
		this.model = new THREE.CSS3DSprite(this.node.cloneNode());
		this.model.position.copy(this.position);
		this.model.element.classList.remove("hidden");
		// this.model.element.id=this.id;

		// this.model.style.top = "0px";

		this.model.scale.copy(this.dims);
		let h = this.model.element.height*0.5-100;
		this.model.element.style.top = h+"px";
	
		
		city.add(this.model);

		
		// this.model.style.width = this.dims.width+"px";
		this.model.element.style.height = this.model.element.naturalHeight+"px";
		this.model.element.style.width = this.model.element.naturalWidth+"px";

		let temp = this.model.element.style.top.replace("px","");
		this.model.element.style.top = temp-this.model.element.height*0.5+"px";
		this.model.element.style.height = "0px";

	}

	update(year) {

		switch(this.scenario[year+""]) {
			case "appear": 
			this.appear();
			break;
			case "color": 
			this.color();
			break;
			case "size": 
			this.size();
			break;
			case "destroy": 
			this.destroy();
			break;
			default:
			if(this.scenario[year+""]===undefined) return;
			if(this.scenario[year+""].startsWith('change')) {

				let url = this.scenario[year+""].replace('change: ','');
				this.change(url);
				console.log(url);
			}
		}
	}

	appear() {
		//console.log(this.model.element.height);
		this.model.element.style.height = this.model.element.naturalHeight+"px";
		this.model.element.style.width = this.model.element.naturalWidth+"px";
		let h = this.model.element.naturalHeight*0.5-100;
		this.model.element.style.top = h+"px";
	}

	change(url) {


		this.model.element.src=url;
		//this.height =this.model.element.naturalHeight;
		//this.width = this.model.element.naturalWidth;

		console.log(this.model.element);

		this.model.element.style.height = this.model.element.naturalHeight+"px";
		this.model.element.style.width = this.model.element.naturalWidth+"px";

		let h = this.model.element.naturalHeight*0.5-100;
		this.model.element.style.top = h+"px";

		//console.log(this.model.element.naturalHeight);



		// let customClass = document.createElement('style');
		// customClass.type = 'text/css';
		// customClass.innerHTML = '.init { height:+'+ this.model.element.height +'px; transition: top 1s, height 1s;}';
		// document.getElementsByTagName('head')[0].appendChild(customClass);
		// this.model.element.classList.add('init');

		// let customClass = document.createElement('style');
		// customClass.type = 'text/css';
		// customClass.innerHTML = '.destroy { height: 0px; width: 24px; top: 100px;}';
		// document.getElementsByTagName('head')[0].appendChild(customClass);
		// this.model.element.classList.add('destroy');

		// let temp = this.id+"";
		// // console.log(temp);
		// this.model.element.classList.add("test");
		

	}

	color() {
		
	}

	size() {
		
	}

	destroy() {
		let temp = this.model.element.style.top.replace("px","");
		this.model.element.style.top = temp-this.model.element.height*0.5+"px";
		this.model.element.style.height = "0px";
	}
}