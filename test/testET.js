var
	assert = require("assert"),
	partials = require("../partials");


describe('Estrad Template', function(){
	var
		page = new Buffer("<div>foo</div>{{=part.test}}{{=part.test}}"),
		nestedPage = new Buffer("<div>foo</div>{{=part.sndlvl}}"),
		variantPage = new Buffer("<div>foo</div>{{=part.test.sndlvl}}"),
		undefObjPage = new Buffer("<div>foo</div>{{=part.test.undef}}"),
		undefPage = new Buffer("<div>foo</div>{{=part.undef}}"),
		intricatePage = new Buffer("{{=part.intricate}}"),
		infinitePage = new Buffer("{{=part.infinite}}"),
		obj  = {
			folder: 'test/modules'
		};

	describe('Basic', function() {
		it('should interpolate test.json', function(done){
			partials(page, obj, function(err, content){
				if(err) throw err;
				assert.equal(content, "<div>foo</div><div>bar</div><div>bar</div>");
				done();
			});
		});
	});

	describe('Nesting', function() {
		it('should interpolate test.json inside sndlvl/template.html', function(done){
			partials(nestedPage, obj, function(err, content){
				if(err) throw err;
				assert.equal(content, "<div>foo</div><div><div>bar</div></div>");
				done();
			});
		});
	});

	describe('Variants', function() {
		it('should interpolate test.json inside test/sndlvl.json', function(done){
			partials(variantPage, obj, function(err, content){
				if(err) throw err;
				assert.equal(content, "<div>foo</div><div>babar</div>");
				done();
			});
		});
	});

	describe('Undefined Object', function() {
		it('should leave the undefined "it" property intact', function(done){
			partials(undefObjPage, obj, function(err, content){
				if(err) throw err;
				assert.equal(content, "<div>foo</div><div>{{!it.bar}}</div>");
				done();
			});
		});
	});

	describe('Undefined Page', function() {
		it('should leave the undefined "part" property intact', function(done){
			partials(undefPage, obj, function(err, content){
				if(err) throw err;
				assert.equal(content, "<div>foo</div>{{=part.undef}}");
				done();
			});
		});
	});

	describe('Infinite Page', function() {
		it('should not get stuck in an infinite loop', function(done){
			partials(infinitePage, obj, function(err, content){
				if(err) throw err;
				assert.equal(content, "<div>{{=part.infinite}}</div>");
				done();
			});
		});
	});

	describe('Intricate Page', function() {
		it('should cover most usecases', function(done){
			partials(intricatePage, obj, function(err, content){
				if(err) throw err;
				assert.equal(content, "<div><div>bar</div><div><div>bar</div></div></div><div>babar</div>foobar");
				done();
			});
		});
	});
});