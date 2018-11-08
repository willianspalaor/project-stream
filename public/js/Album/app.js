
var self = this;

function run(){
	alert('run');
}


(function(){

	console.log('passou');	
	self.run();
})();