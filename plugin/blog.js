var ModelBlog = require("../model/post");
var Msg = require("../model/msg");
// add 对象
module.exports.add = {
	get:function(req,res,next){
		// res.send('发表');
		res.render('blog/add',{
			title:"发表"
		});
	},
	post:function(req,res,next){
	
		var getData = {
			author: req.session.user._id,
			title: req.body.title,
			content: req.body.content
		}
		console.log(getData);
		ModelBlog.create(getData,function(err,data){
			
			if(err){
				console.log(err);
			}
			res.redirect('/blog/view/'+ data._id);
			// res.send(data);
		});

		// res.send('发表成功');
	}
}

// list 对象
module.exports.list = {
	get:function(req,res,next){
		
		ModelBlog.find({},null,{sort:{_id:-1}})
			// 近表关联查询
			.populate('author').exec(function(err,data){
				// console.log(data);return;
				if(err){console.log(err);}

				res.render('blog/list',{
					title:"微博列表",
					list:data
				})

			});
	}
}

// view 对象
module.exports.view = {
	get:function(req,res,next){
		
		var getData = {
			_id:req.param('_id')
		}

		ModelBlog.findOne(getData,function(err,data){
			
			if(err){
				console.log(err);
			}

			if(data){
				res.render('blog/view',{
					title:'内容页',
					view:data
				});
			}else{
				res.send('您还没有博文');
			}
		});
	}
}

module.exports.editor = {
	get:function(req,res,next){
		var _id = req.param('_id');
		console.log(_id);

		ModelBlog.findById(_id,function(err,data){
			if(err) console.log(err);
			
			if(data){
				res.render('blog/editor',{
					title:'修改',
					editor:data
				})
			}
		});

	},
	post:function(req,res,next){

		var body = req.body;
		
		var posData = {
			_id : req.param('_id')
		}
		
		var posData2 = {
			title:body.title,
			content:body.content
		}
		
		ModelBlog.update(posData,{$set:posData2},function(err,data){
				console.log(data)
				if(data){
					Msg.postMsg.status=true;
					Msg.postMsg.msg=Msg.editor.success;
					res.send(Msg.postMsg);
				}else{
					Msg.postMsg.msg=Msg.editor.error;
					res.send(Msg.postMsg);
				}
		})
		
	}
};

