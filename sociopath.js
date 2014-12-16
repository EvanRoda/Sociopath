var storage = $.localStorage;

function formatDateToIso(date){
    return moment(date).format('YYYY-MM-DDTHH:mm:ss');
}

console.log(storage.get('posts'));

//storage.remove('posts');

if(!storage.get('posts')){
    storage.set('posts.zeropost', {
        _id: 'zeropost',
        body: 'Добро пожаловать в вашу личную социальную сеть.',
        date: formatDateToIso()
    });
}

console.log(storage.keys());

function blogModel(){
    var self = this;

    var getPosts = function(){
        var temp = storage.get('posts');
        var list = [];
        for(var key in temp){
            if(temp.hasOwnProperty(key)){
                list.push(temp[key]);
            }
        }
        return list;
    };

    self.newPost = ko.observable({
        _id: '',
        body: '',
        date: null
    });

    self.posts = ko.observableArray(getPosts());

    self.posts.sort(function(left, right){
         return moment(left.date) <= moment(right.date) ? 1 : -1;
    });

    self.removePost = function(post){
        self.posts.remove(post);
        storage.remove('posts.' + post._id);
    };

    self.addPost = function(post){
        var count = storage.get('count') || 0;
        post.date = formatDateToIso();
        post._id = 'post' + count++;

        storage.set('count', count);

        self.posts.unshift(post);
        storage.set('posts.' + post._id, post);

        self.newPost({
            _id: '',
            body: '',
            date: null
        });

        $('#createPost').modal('hide');
    };
}

ko.applyBindings(new blogModel());

