var storage = $.localStorage, blog;

function formatDateToIso(date){
    return moment(date).format('YYYY-MM-DDTHH:mm:ss');
}

function start(){
    if(!storage.get('posts')){
        storage.set('posts.zeropost', {
            _id: 'zeropost',
            body: 'Welcome to your local blog.',
            date: formatDateToIso()
        });
    }

    if(!storage.get('profile')){
        storage.set('profile', {
            nickname: 'userName',
            blogName: 'My blog'
        })
    }

    blog.prepareStart();
}

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

    self.profileChange = ko.observable();
    self.profile = ko.observable();
    self.posts = ko.observableArray();
    self.newPost = ko.observable();

    self.prepareStart = function(){
        self.profile(storage.get('profile'));
        self.posts(getPosts());
        self.posts.sort(function(left, right){
            return moment(left.date) <= moment(right.date) ? 1 : -1;
        });
    };

    self.openCreate = function(){
        self.newPost({
            _id: '',
            body: '',
            date: null
        });
        $('#createPost').modal('show');
    };

    self.removePost = function(post){
        if(confirm('Do you really want to delete this post?')){
            self.posts.remove(post);
            storage.remove('posts.' + post._id);
        }
    };

    self.addPost = function(post){
        var count = storage.get('count') || 0;
        post.date = formatDateToIso();
        post._id = 'post' + count++;

        self.posts.unshift(post);
        try{
            storage.set('count', count);
            storage.set('posts.' + post._id, post);
        }catch(e){
            alert(e.message);
        }

        $('#createPost').modal('hide');
    };

    self.openProfile = function(){
        self.profileChange(storage.get('profile'));
        $('#profile').modal('show');
    };

    self.saveProfile = function(change){
        self.profile(change);
        try{
            storage.set('profile', change);
        }catch(e){
            alert(e.message);
        }

        $('#profile').modal('hide');
    };

    self.deleteBlog = function(){
        if(confirm('Do you really want to delete your blog?')){
            $('#profile').modal('hide');
            storage.removeAll();
            start();
        }
    };

    self.prepareStart();
}

blog = new blogModel();

start();

ko.applyBindings(blog);