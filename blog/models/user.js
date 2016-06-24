var mongodb = require('./db');  
function User(user) { 
	this.name = user.name; 
	this.password = user.password; 
}; 
module.exports = User;  
User.get = function get(username, callback) { 
	mongodb.open(function(err, db) { 
		if (err) { 
			return callback(err); 
		}     
		// ��ȡ users ���� 
		db.collection('users', function(err, collection) { 
			if (err) { 
				mongodb.close(); 
				return callback(err); 
			}       
			// ���� name ����Ϊ username ���ĵ� 
			collection.findOne({name: username}, function(err, doc) { 
				mongodb.close(); 
				if (doc) {           
					// ��װ�ĵ�Ϊ User ���� 
					var user = new User(doc); 
					callback(err, user); 
				} else { 
					callback(err, null); 
				} 
			}); 
		}); 
	}); 
}; 
