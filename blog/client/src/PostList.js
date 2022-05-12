import * as React from 'react';
import axios from 'axios';
import { CommentCreate } from './CommentCreate';
import { CommentList } from './CommentList';

const Post = ({ post }) => {
  return (
    <div className='card'
      style={{ width: '30%', marginBottom: '20px' }}>
      <div className='card-body'>
        <h3>{post.title}</h3>
        <CommentList postId={post.id} />
        <CommentCreate postId={post.id} />
      </div>
    </div>
  );
}

const PostList = () => {
  const [posts, setPosts] = React.useState({});

  const fetchPosts = async () => {
    const res = await axios.get('http://localhost:4000/posts');
    setPosts(res.data);
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className='d-flex flex-row flex-wrap justify-content-between'>
      {
        Object.values(posts)
          .map(post => <Post post={post} key={post.id} />)
      }
    </div>
  );
};

export { PostList };